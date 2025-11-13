 const matchModel = require('../models/matchModel');
 const socket = require('./socketController');
 const path = require('path');

 // GET /tasks - Listar todas as tarefas
 const comecaPartida = (req, res) => {
  const roomId = req.params.id;
  const playerId = req.query.playerid; // UUID fixo

  const match = socket.matches[roomId];
  if (!match) return res.redirect('/');

  const players = matchModel.serializePlayers(match.players); // converte para {playerId: role}

  res.render(path.join(__dirname, '..', 'view', 'field.ejs'), {
    state: match.state,
    players,
    playerid: playerId,
    roomId,
  });
 };

  

module.exports = {
   comecaPartida ,
};
 