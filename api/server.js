const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const fetch = require('node-fetch'); // Adicionado para garantir compatibilidade
const app = express();
const { getFirebaseAuthToken } = require('./firebase-auth');


require('dotenv').config();

// Configuração do Firebase
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vitrine-virtual-45979-default-rtdb.firebaseio.com"
});

// Middlewares
app.use(express.json());
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Função auxiliar para obter token
async function getFirebaseIdToken(email, password) {
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
}

// Helper para mensagens de erro
function getFirebaseError(message) {
  const errors = {
    'email-already-in-use': 'Email já está em uso',
    'weak-password': 'Senha deve ter pelo menos 6 caracteres',
    'invalid-email': 'Email inválido'
  };
  return errors[message] || 'Erro no registro';
}

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
  try {
    const user = await admin.auth().getUserByEmail(req.body.email);
    const token = await getFirebaseIdToken(req.body.email, req.body.password);
    
    res.json({ 
      success: true, 
      idToken: token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      success: false, 
      message: getFirebaseError(error.message),
      error: error.message 
    });
  }
});



app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validação
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos os campos são obrigatórios' 
      });
    }

    // 1. Criar usuário
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // 2. Salvar no Realtime Database
    await admin.database().ref('users/' + user.uid).set({
      name,
      email,
      createdAt: Date.now()
    });

    // 3. Gerar token (usando a função do módulo)
    const firebaseToken = await getFirebaseAuthToken(
      email, 
      password,
      serviceAccount.apiKey // Passando apenas a API key
    );

    res.json({
      success: true,
      uid: user.uid,
      idToken: firebaseToken,
      message: 'Registro concluído com sucesso!'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    const errorMessage = error.code === 'auth/email-already-in-use' 
      ? 'Este email já está em uso' 
      : 'Erro durante o registro';
    
    res.status(400).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
});




app.get('/api/protected', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    res.json({ 
      status: 'Acesso permitido',
      user: decodedToken
    });
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));