const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

// Configuração do Firebase
const serviceAccount = require('./service-account-key.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

app.use(cors());
app.use(express.json());

// Rota raiz para verificar se a API está online
app.get('/api', (req, res) => {
  res.json({
    status: 'API Online',
    endpoints: {
      login: '/api/login',
      protected: '/api/protected'
    }
  });
});

// Rota de Login Corrigida
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verificar se o usuário existe
    const user = await admin.auth().getUserByEmail(email);
    
    // 2. Criar token customizado (para uso no Firebase Client SDK)
    const token = await admin.auth().createCustomToken(user.uid);
    
    // 3. Obter o token de acesso real (para autenticação HTTP)
    const firebaseToken = await getFirebaseIdToken(email, password);
    
    res.json({
      success: true,
      customToken: token, // Para uso no cliente
      idToken: firebaseToken // Para autenticação HTTP
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

// Função para obter o token JWT real do Firebase
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
  
  const data = await response.json();
  return data.idToken;
}

// Rota protegida
app.get('/api/protected', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ 
      status: 'Acesso permitido',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Token inválido' });
  }
});

// Rota de Registro
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. Criar usuário no Firebase Auth
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // 2. Salvar dados adicionais no Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      role: 'user' // Defina roles conforme necessário
    });

    // 3. Gerar token para login automático
    const token = await admin.auth().createCustomToken(user.uid);
    const firebaseToken = await getFirebaseIdToken(email, password);

    res.json({
      success: true,
      uid: user.uid,
      token: firebaseToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: 'Erro no registro',
      error: error.message
    });
  }
});





app.use(cors({
  origin: [
    'http://localhost:4200', 
    'https://vitrine-68en.onrender.com/api' // Atualize com sua URL real
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));