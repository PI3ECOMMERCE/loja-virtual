const admin = require('firebase-admin');

module.exports = async function getFirebaseIdToken(email, password, serviceAccount) {
  const firebaseRestURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${serviceAccount.apiKey}`;
  
  const response = await fetch(firebaseRestURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true
    })
  });
  
  if (!response.ok) {
    throw new Error('Falha ao obter token');
  }
  
  const data = await response.json();
  return data.idToken;
};