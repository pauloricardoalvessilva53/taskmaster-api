const express = require('express');
const cors = require('cors');

const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do TaskMaster operando com sucesso!');
});

// Liga o servidor
const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor Back-end rodando na porta ${PORTA}`);
});