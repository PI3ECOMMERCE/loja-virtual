const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

// Configuração do Firebase (incluindo Auth)
const serviceAccount = require('service-account-key.json');
// Inicializa o Firebase Admin SDK
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const auth = admin.auth(); // Firebase Auth

app.use(cors());
app.use(express.json());

// Rota de Login (substitui seu auth fake)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica credenciais no Firebase Auth
    const user = await auth.getUserByEmail(email);
    
    // Cria um token JWT personalizado (opcional)
    const token = await admin.auth().createCustomToken(user.uid);
    
    res.json({ success: true, token });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

// Rota protegida (exemplo)
app.get('/api/protected', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) return res.status(403).json({ error: 'Token não fornecido' });

  try {
    // Verifica o token JWT
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ message: 'Acesso permitido!', user: decodedToken });
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
});

app.listen(3000, () => console.log('API rodando em http://localhost:3000'));