const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
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

// Obter a chave pública do Firebase do environment
const firebaseApiKey = process.env.FIREBASE_API_KEY;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Helper para mensagens de erro
function getFirebaseError(message) {
  const errors = {
    'auth/email-already-in-use': 'Email já está em uso',
    'auth/weak-password': 'Senha deve ter pelo menos 6 caracteres',
    'auth/invalid-email': 'Email inválido',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta'
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
    console.log('Tentativa de login para:', req.body.email);
    
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Primeiro verifica se o usuário existe
    let user;
    try {
      user = await admin.auth().getUserByEmail(req.body.email);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado',
        error: 'auth/user-not-found'
      });
    }

    // Depois tenta autenticar
    let token;
    try {
      token = await getFirebaseAuthToken(
        req.body.email, 
        req.body.password,
        firebaseApiKey
      );
    } catch (authError) {
      console.error('Erro na autenticação:', authError);
      return res.status(401).json({
        success: false,
        message: getFirebaseError(authError.code),
        error: authError.code
      });
    }
    
    res.json({ 
      success: true, 
      idToken: token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || ''
      }
    });
  } catch (error) {
    console.error('Erro geral no login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno no servidor',
      error: error.message 
    });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos os campos são obrigatórios' 
      });
    }

    // 1. Criar usuário usando Admin SDK
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

    // 3. Tentar login automático com a chave pública
    try {
      const token = await getFirebaseAuthToken(
        email, 
        password,
        firebaseApiKey // Usando a chave pública aqui
      );
      
      return res.json({
        success: true,
        uid: user.uid,
        idToken: token,
        message: 'Registro e login automático concluídos!'
      });
    } catch (tokenError) {
      console.error('Erro ao gerar token:', tokenError);
      return res.json({
        success: true,
        uid: user.uid,
        message: 'Usuário criado. Faça login manualmente.'
      });
    }

  } catch (error) {
    console.error('Erro detalhado no registro:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    res.status(400).json({
      success: false,
      message: getFirebaseError(error.code),
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
    res.status(403).json({ 
      error: 'Token inválido',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
