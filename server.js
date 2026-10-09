const express = require('express');
const cors = require('cors');
const db = require('./database'); // Conecta o servidor ao arquivo do banco de dados

const app = express();
app.use(cors());
app.use(express.json());

// 1. Rota de Cadastro de Usuário (POST)
app.post('/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;
  
  db.run(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`,
    [nome, email, senha],
    function(err) {
      if (err) {
        return res.status(400).json({ erro: 'Erro ao cadastrar. E-mail pode já estar em uso.' });
      }
      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: this.lastID });
    }
  );
});

// 2. Rota de Autenticação / Login (POST)
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  
  db.get(`SELECT * FROM usuarios WHERE email = ? AND senha = ?`, [email, senha], (err, row) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor.' });
    if (!row) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    
    res.json({ mensagem: 'Login realizado com sucesso!', usuario_id: row.id, nome: row.nome });
  });
});

// 3. Rota de Cadastrar Nova Tarefa (POST)
app.post('/tarefas', (req, res) => {
  const { titulo, descricao, vencimento, lembrete, prioridade, usuario_id } = req.body;
  
  // Aplicação da RN04: O título da tarefa é obrigatório
  if (!titulo) {
    return res.status(400).json({ erro: 'O título da tarefa é obrigatório.' });
  }

  db.run(`INSERT INTO tarefas (titulo, descricao, vencimento, lembrete, prioridade, usuario_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [titulo, descricao, vencimento, lembrete, prioridade, usuario_id],
    function(err) {
      if (err) return res.status(400).json({ erro: 'Erro ao salvar a tarefa.' });
      res.status(201).json({ mensagem: 'Tarefa cadastrada com sucesso!', id: this.lastID });
    }
  );
});

// 4. Rota de Listar Tarefas do Usuário (GET)
app.get('/tarefas/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  
  db.all(`SELECT * FROM tarefas WHERE usuario_id = ?`, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar as tarefas.' });
    res.json(rows);
  });
});

const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`API do TaskMaster rodando com sucesso na porta ${PORTA}!`);
});