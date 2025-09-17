import React, { useState } from 'react';
import axios from 'axios';

function Vote() {
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [vote, setVote] = useState(null);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/user', { pseudo, email });
            setIsLoggedIn(true);
        } catch (error) {
            alert("Erreur de connexion: " + error.response.data);
        }
    };
    
    const handleVote = async (choice) => {
        try {
            await axios.post('/api/vote', { pseudo, choice });
            setVote(choice);
            alert("Vote enregistré!");
        } catch (error) {
            alert("Erreur: " + error.response.data);
        }
    };
    
    if (!isLoggedIn) {
        return (
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Pseudo" 
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <button type="submit">Se connecter</button>
            </form>
        );
    }
    
    return (
        <div>
            <h2>Est-ce que François Bayrou nous manque?</h2>
            <button onClick={() => handleVote('Oui')} disabled={vote}>Oui</button>
            <button onClick={() => handleVote('Non')} disabled={vote}>Non</button>
            
            {vote && <p>Vous avez voté: {vote}</p>}
            
            <a href="/results">Voir les résultats</a>
        </div>
    );
}

export default Vote;