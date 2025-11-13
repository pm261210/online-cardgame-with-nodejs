const { v4: uuidv4 } = require('uuid');
const matchModel = require('../models/matchModel');


let waitingPlayer = null;
let waitingPlayerId = null;
let matches = {}; // Estado das partidas: { roomId: { players, state } }
let playerIdentities = {}; 

module.exports = (io) => {
  io.on('connection', (socket) => {
    
    playerIdentities[socket.id] = socket.id;
    const playerId = uuidv4();
    //console.log('Novo jogador conectado: ' + playerId);

    if (waitingPlayer === null) {
      waitingPlayerId = playerId;
      waitingPlayer = socket;
      socket.emit('waitingForOpponent');
    } else {
      const roomId = uuidv4();
      socket.join(roomId);
      waitingPlayer.join(roomId);

      const state = matchModel.createInitialGameState();
      //console.log('ID sala: ' + roomId); matchModel

      matches[roomId] = {
        players: {
          [waitingPlayer.id]: { id: waitingPlayerId, role: 'player1', socketId: waitingPlayer.id },
          [socket.id]: { id: playerId, role: 'player2', socketId: socket.id }
        },
        state,
      };


      io.to(roomId).emit('gameStart', {
        roomId,
        state,
        players: matches[roomId].players,//Object.keys(matches[roomId].players),
      });


      waitingPlayer = null;
    }

    socket.on('joinRoom', ({ roomId, playerId }) => {
      const match = matches[roomId];
      if (!match) return;

      const oldEntry = Object.entries(match.players).find(
        ([_, player]) => player.id === playerId
      );

      if (!oldEntry) return;

      const [oldSocketId, playerData] = oldEntry;
      // Atualiza socketId
      delete match.players[oldSocketId];
      match.players[socket.id] = { ...playerData, socketId: socket.id };
      //console.log(match.state);

      socket.join(roomId);
    });

  socket.on('opcoesCarta', ({roomId, idcarta}) => {
    if (!matches[roomId]) return;
    const match = matches[roomId];

    const playerData = match.players[socket.id];
    if (!playerData) return;
    const role = playerData.role;

    match.state = matchModel.descelecionaCartas(match);
    match.state = matchModel.opcoesCarta(match, role, idcarta);

    io.to(roomId).emit('stateUpdate', {
      roomId,
      state: match.state,
      players: matchModel.serializePlayers(match.players),
    });
  });

  socket.on('espacosDisponiveis', ({roomId, idcarta, movement, attack}) => {
    if (!matches[roomId]) return;
    const match = matches[roomId];

    const playerData = match.players[socket.id];
    if (!playerData) return;
    const role = playerData.role;

    match.state = matchModel.descelecionaCartas(match);
    match.state = matchModel[attack](match, role, idcarta);
    match.state = matchModel[movement](match, role, idcarta);
    
    io.to(roomId).emit('stateUpdate', {
      roomId,
      state: match.state,
      players: matchModel.serializePlayers(match.players),
    });
  });


  socket.on('movimentaCarta', ({roomId, idcarta, idespaco}) => {
    if (!matches[roomId]) return;
    const match = matches[roomId];

    const playerData = match.players[socket.id];
    if (!playerData) return;
    const role = playerData.role;

    match.state = matchModel.movimentaCarta(match, role, idcarta, idespaco);

    io.to(roomId).emit('stateUpdate', {
      roomId,
      state: match.state,
      players: matchModel.serializePlayers(match.players),
    });
  });

  socket.on('danificaCarta', ({roomId, idcarta, idespaco}) => {
    if (!matches[roomId]) return;
    const match = matches[roomId];

    const playerData = match.players[socket.id];
    if (!playerData) return;
    const role = playerData.role;

    match.state = matchModel.danificaCarta(match, idcarta, idespaco, role);
    match.state = matchModel.descelecionaCartas(match);

    io.to(roomId).emit('stateUpdate', {
      roomId,
      state: match.state,
      players: matchModel.serializePlayers(match.players),
    });
  });

  socket.on('turnChange', ({ roomId}) => {
      if (!matches[roomId]) return;
      const match = matches[roomId];

      match.state = matchModel.descelecionaCartas(match);
      match.state = matchModel.turnChange(match);
      // Enviar estado atualizado para ambos os jogadores
      io.to(roomId).emit('stateUpdate', match.state);
    });

    socket.on('disconnect', () => {
      if (waitingPlayer && waitingPlayer.id === socket.id) {
        waitingPlayer = null;
      }

      
    });

});  
};


module.exports.matches = matches;