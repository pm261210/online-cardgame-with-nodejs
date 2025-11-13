 // server.js
const http = require('http');
const socketIo = require('socket.io');
const app = require('./src/app');
const sequelize = require('./src/config/db');

const server = http.createServer(app);
const io = socketIo(server);

// Importa o controlador do socket
require('./src/controllers/socketController')(io);

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conexão com o banco de dados estabelecida com sucesso.');
    return sequelize.sync();
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Erro ao conectar com o banco de dados:', err);
  });