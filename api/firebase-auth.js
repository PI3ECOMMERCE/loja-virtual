const fetch = (...args) => 
  import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
  getFirebaseAuthToken: async (email, password, apiKey) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true })
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      return data.idToken;
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      throw error;
    }
  }
};