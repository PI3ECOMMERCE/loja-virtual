const fetch = require('node-fetch');

module.exports = {
  getFirebaseAuthToken: async (email, password, apiKey) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    
    return data.idToken;
  }
};