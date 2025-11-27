 const Matches = require('../models/matchModel');
 const socket = require('./socketController');
 const path = require('path');

 // GET /tasks - Listar todas as tarefas
 const comecaPartida = async(req, res) => {
  const roomId = req.params.id;
  const playerId = req.query.playerid; // UUID fixo

  const match = await Matches.findByPk(roomId);
  if (!match) return res.redirect('/');

  ///const players = matchModel.serializePlayers(match.players); // converte para {playerId: role}
  //console.log('match: ',match)
  let playerrole = null
  for (player in match.players){
    if(match.players[player].id == playerId){
      playerrole = match.players[player].role
    }
  }

  res.render(path.join(__dirname, '..', 'view', 'field.ejs'), {
    match,
    playerid: playerId,
    roomId,
    playerRole: playerrole,
  });
 };

  

module.exports = {
   comecaPartida ,
};
 