const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

const { getFirebaseIdToken } = require('./firebase-auth');


// Configuração do Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

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
    const token = await getFirebaseIdToken(
      req.body.email, 
      req.body.password,
      serviceAccount // Passando o serviceAccount como parâmetro
    );
    
    res.json({ success: true, idToken: token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ success: false, error: error.message });
  }
});



app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validação básica
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

    // 2. Salvar dados adicionais (Realtime Database)
    await admin.database().ref('users/' + user.uid).set({
      name,
      email,
      createdAt: Date.now()
    });

    // 3. Gerar token (agora com tratamento de erro)
    let firebaseToken;
    try {
      firebaseToken = await getFirebaseIdToken(email, password);
    } catch (tokenError) {
      console.error('Erro ao gerar token:', tokenError);
      // Retorna sucesso mesmo sem token, pois o usuário foi criado
      return res.json({
        success: true,
        uid: user.uid,
        message: 'Usuário criado, faça login manualmente'
      });
    }

    res.json({
      success: true,
      uid: user.uid,
      idToken: firebaseToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Mensagens de erro mais amigáveis
    let errorMessage = 'Erro no registro';
    if (error.message.includes('email-already-in-use')) {
      errorMessage = 'Email já está em uso';
    } else if (error.message.includes('weak-password')) {
      errorMessage = 'Senha muito fraca (mínimo 6 caracteres)';
    }

    res.status(400).json({
      success: false,
      message: errorMessage,
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