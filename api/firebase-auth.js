const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
  getFirebaseAuthToken: async (email, password, apiKey) => {
    if (!apiKey) throw new Error('Chave da API não configurada!');
    
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    return data.idToken;
  }
};