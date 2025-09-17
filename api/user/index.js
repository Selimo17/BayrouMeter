const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const endpoint = process.env.COSMOSDB_ENDPOINT;
    const key = process.env.COSMOSDB_KEY;
    const client = new CosmosClient({ endpoint, key });
    
    const database = client.database("BayrouMeterDB");
    const container = database.container("users");
    
    const { pseudo, email } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const query = `SELECT * FROM c WHERE c.pseudo = "${pseudo}" OR c.email = "${email}"`;
    const { resources: existingUsers } = await container.items.query(query).fetchAll();
    
    if (existingUsers.length > 0) {
        context.res = {
            status: 400,
            body: "User already exists"
        };
        return;
    }
    
    // Créer un nouvel utilisateur
    const newUser = {
        id: pseudo,
        pseudo,
        email,
        createdAt: new Date().toISOString()
    };
    
    await container.items.create(newUser);
    
    context.res = {
        status: 201,
        body: newUser
    };
};