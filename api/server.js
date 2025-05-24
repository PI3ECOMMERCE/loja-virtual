const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

// Configuração do Firebase
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vitrine-virtual-45979-default-rtdb.firebaseio.com"
});

app.use(express.json());
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rotas
app.get('/api', (req, res) => {
  res.json({
    status: 'API Online',
    endpoints: {
      login: '/api/login',
      protected: '/api/protected',
      register: '/api/register'
    }
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    const firebaseToken = await getFirebaseIdToken(email, password);
    
    res.json({
      success: true,
      idToken: firebaseToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Credenciais inválidas',
      error: error.message 
    });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    //   Realtime Database
    await admin.database().ref('users/' + user.uid).set({
      name,
      email,
      createdAt: Date.now()
    });

    const firebaseToken = await getFirebaseIdToken(email, password);
    
    res.json({
      success: true,
      uid: user.uid,
      idToken: firebaseToken // Padronizado para idToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: getFirebaseError(error.message),
      error: error.message
    });
  }
});



function getFirebaseError(message) {
  const errors = {
    'email-already-in-use': 'Email já está em uso',
    'weak-password': 'Senha deve ter pelo menos 6 caracteres',
    'invalid-email': 'Email inválido'
  };
  return errors[message] || 'Erro no registro';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));