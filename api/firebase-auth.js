const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
  getFirebaseAuthToken: async (email, password, apiKey) => {
    try {
      // Validação dos parâmetros
      if (!email || !password || !apiKey) {
        throw new Error('Parâmetros incompletos para autenticação');
      }

      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
      
      console.log(`[Firebase Auth] Tentando autenticar: ${email}`); // Log para debug
      
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

      // Log detalhado para debug
      console.log('[Firebase Auth] Resposta:', {
        status: response.status,
        data: { ...data, idToken: data.idToken ? 'presente' : 'ausente' }
      });

      if (!response.ok) {
        const errorMsg = data.error?.message || 'Erro desconhecido no Firebase';
        throw new Error(`Firebase Auth Error: ${errorMsg} (${response.status})`);
      }

      if (!data.idToken) {
        throw new Error('Token não recebido do Firebase');
      }

      return data.idToken;
    } catch (error) {
      console.error('[Firebase Auth] Erro detalhado:', {
        message: error.message,
        stack: error.stack,
        ...(error.response && { status: error.response.status })
      });
      throw error; // Re-lança o erro para ser tratado no chamador
    }
  }
};