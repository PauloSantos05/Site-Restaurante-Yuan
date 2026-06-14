/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-Memory Fallback Database for the Preview Environment (so it doesn't fail if localhost is unreachable)
interface InMemoryUser {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senhaHash: string;
}

const mockUsers: InMemoryUser[] = [
  {
    id: 1,
    nome: "Darlan d'Szechuan",
    email: "cliente@yuan.com.br",
    telefone: "(11) 98765-4321",
    // Hash for 'yuan123'
    senhaHash: "$2a$10$oBfRjS.D97qP5Cg1m7P6.es/zC9vH778R6RkGclit23e1F.N9vR1O"
  }
];

// MariaDB Database configuration details
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'yuan_user',
  password: process.env.DB_PASSWORD || 'yuan123',
  database: process.env.DB_DATABASE || 'yuan',
  port: Number(process.env.DB_PORT) || 3306,
  connectTimeout: 4000 // 4 seconds timeout to fail fast and fall back gracefully
};

let dbConnection: mysql.Connection | null = null;
let isUsingFallbackMode = false;

function initDatabase() {
  console.log(`[Database] Tentando conectar ao MariaDB em ${dbConfig.host}:${dbConfig.port}...`);
  
  try {
    dbConnection = mysql.createConnection(dbConfig);

    dbConnection.connect((err) => {
      if (err) {
        console.warn(`\n⚠️ [Database Warning] Não foi possível conectar ao MariaDB no endereço '${dbConfig.host}'.`);
        console.warn(`Isso ocorre porque o banco de dados MariaDB está sendo executado localmente em seu computador (localhost), enquanto o preview roda na nuvem.`);
        console.warn(`Para conectar ao seu banco real, configure um host público ou use as variáveis de ambiente.`);
        console.warn(`👉 O Restaurante Yuan continuará a rodar usando o Banco de Dados em Memória simulado temporariamente para o seu teste.\n`);
        
        isUsingFallbackMode = true;
        dbConnection = null;
        return;
      }

      console.log(`[Database] Conectado com sucesso ao MariaDB '${dbConfig.database}'!`);
      isUsingFallbackMode = false;

      // Create table if it does not exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS usuarios (
          id       INT AUTO_INCREMENT PRIMARY KEY,
          nome     VARCHAR(100) NOT NULL,
          email    VARCHAR(150) NOT NULL UNIQUE,
          telefone VARCHAR(20),
          senha    VARCHAR(255) NOT NULL
        )
      `;

      dbConnection?.query(createTableQuery, (tableErr) => {
        if (tableErr) {
          console.error('[Database Error] Erro ao verificar ou criar tabela "usuarios":', tableErr);
        } else {
          console.log('[Database] Tabela "usuarios" verificada/criada com sucesso no MariaDB.');
        }
      });
    });

    // Handle database connection unexpected errors
    dbConnection.on('error', (err) => {
      console.error('[Database Error] Ocorreu um erro na conexão do MariaDB:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('[Database] Conexão com MariaDB perdida. Re-inicializando...');
        initDatabase();
      } else {
        isUsingFallbackMode = true;
      }
    });

  } catch (error) {
    console.warn(`[Database Warning] Falha ao tentar carregar o driver ou estabelecer conexão:`, error);
    isUsingFallbackMode = true;
  }
}

// Initialise DB connection
initDatabase();

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    database: isUsingFallbackMode ? "fallback-memory" : "mariadb",
    host: dbConfig.host
  });
});

// ── CADASTRO ──
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Os campos nome, email e senha são obrigatórios.' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    // If we are in fallback simulation mode
    if (isUsingFallbackMode || !dbConnection) {
      const emailExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return res.status(409).json({ erro: 'E-mail imperial já cadastrado no sistema simulado.' });
      }

      const newUser: InMemoryUser = {
        id: mockUsers.length + 1,
        nome,
        email: email.toLowerCase(),
        telefone: telefone || "",
        senhaHash: hash
      };

      mockUsers.push(newUser);
      console.log(`[Mock DB] Novo usuário cadastrado em memória: ${nome} (${email})`);
      return res.json({ 
        ok: true, 
        info: "Cadastrado em memória local (MariaDB offline)",
        isMockMode: true 
      });
    }

    // Direct database insert in MariaDB
    dbConnection.query(
      'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
      [nome, email.toLowerCase(), telefone || "", hash],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'E-mail imperial já cadastrado.' });
          }
          console.error('[MySQL Error] Erro ao cadastrar usuário:', err);
          return res.status(500).json({ erro: 'Erro ao cadastrar usuário no MariaDB.' });
        }
        res.json({ ok: true, isMockMode: false });
      }
    );

  } catch (err: any) {
    console.error('[Server Error] Erro inesperado no cadastro:', err);
    res.status(500).json({ erro: 'Ocorreu um erro interno no servidor.' });
  }
});

// ── LOGIN ──
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Os campos de email e senha são obrigatórios.' });
  }

  try {
    // If we are in fallback simulation mode
    if (isUsingFallbackMode || !dbConnection) {
      const matchedUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!matchedUser) {
        return res.status(401).json({ erro: 'E-mail imperial ou senha incorretos na simulação.' });
      }

      const matches = await bcrypt.compare(senha, matchedUser.senhaHash);
      if (!matches) {
        return res.status(401).json({ erro: 'E-mail imperial ou senha incorretos na simulação.' });
      }

      return res.json({ 
        ok: true, 
        nome: matchedUser.nome,
        email: matchedUser.email,
        phone: matchedUser.telefone,
        info: "Logado através da memória local (MariaDB offline)",
        isMockMode: true 
      });
    }

    // Direct database lookup
    dbConnection.query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email.toLowerCase()], 
      async (err, results) => {
        if (err) {
          console.error('[MySQL Error] Erro na consulta de login:', err);
          return res.status(500).json({ erro: 'Erro ao conectar ao banco de dados MariaDB.' });
        }

        const rows = results as any[];
        if (rows.length === 0) {
          return res.status(401).json({ erro: 'E-mail imperial ou senha incorretos.' });
        }

        const matchedRow = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, matchedRow.senha);
        if (!senhaCorreta) {
          return res.status(401).json({ erro: 'E-mail imperial ou senha incorretos.' });
        }

        res.json({ 
          ok: true, 
          nome: matchedRow.nome,
          email: matchedRow.email,
          phone: matchedRow.telefone,
          isMockMode: false 
        });
      }
    );

  } catch (err) {
    console.error('[Server Error] Erro inesperado no cadastro:', err);
    res.status(500).json({ erro: 'Ocorreu um erro interno no servidor.' });
  }
});

// Vite & Static file handling
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Server] Vite middleware configurado para desenvolvimento.");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("[Server] Servindo arquivos estáticos em produção na pasta /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`================================================`);
    console.log(`🏮 RESTAURANTE YUAN IMPERIAL RODANDO COM SUCESSO 🏮`);
    console.log(`Porta de entrada principal: http://localhost:${PORT}`);
    console.log(`================================================`);
  });
}

startServer();
