const sqlite3 = require('sqlite3').verbose();

// Cria (ou conecta) ao arquivo do banco de dados local
const db = new sqlite3.Database('./taskmaster.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado com sucesso ao banco de dados SQLite.');
  }
});

// Criação das tabelas
db.serialize(() => {
  // Cria a Tabela de Usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )
  `);

  // Cria a Tabela de Tarefas
  db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT,
      vencimento TEXT,
      lembrete TEXT,
      prioridade TEXT,
      usuario_id INTEGER,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )
  `);
  
  console.log('Tabelas de Usuários e Tarefas criadas/verificadas com sucesso!');
});

module.exports = db;