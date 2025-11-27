const { v4: uuidv4 } = require('uuid');
const Match = require('../models/matchModel');
const matchInitial = require('../models/match/matchInitial');
const matchAttack = require('../models/match/attackModel');
const matchMoviment = require('../models/match/movementModel');

let waitingPlayer = null;
let waitingPlayerId = null;
let playerId = null;

module.exports = (io) => {
  io.on('connection', (socket) => {

    

    // --------------------------
    // MATCHMAKING
    // --------------------------
    socket.on("registerPlayer", async({ playerId: incomingId }) => {
        playerId = incomingId;
        console.log("Jogador registrado:", playerId);

        // só depois de registrar você pode colocar ele na fila

        if (!waitingPlayer) {
          waitingPlayer = socket;
          waitingPlayerId = playerId;
          socket.emit('waitingForOpponent');
        } else {
          const roomId = uuidv4();
          socket.join(roomId);
          waitingPlayer.join(roomId);

          console.log('waitingPlayer: '+waitingPlayerId)
          console.log('Player: '+playerId)
          const state = await matchInitial.createInitialGameState(waitingPlayerId, playerId);

          const players = {
            [waitingPlayer.id]: { id: waitingPlayerId, role: 'player1', socketId: waitingPlayer.id },
            [socket.id]: { id: playerId, role: 'player2', socketId: socket.id }
          };

          // 👉 SALVA MATCH NO BANCO
          matchInitial.createMatch(roomId, players, state);

          io.to(roomId).emit('gameStart', {
            roomId,
            state,
            players
          });

          waitingPlayer = null;
        }

    });

    

    // --------------------------
    // JOIN ROOM DE VOLTA
    // --------------------------
    socket.on('joinRoom', async ({ roomId, playerId }) => {
      const match = await matchInitial.getMatch(roomId);
      if (!match) return;

      const players = match.players;

      const oldEntry = Object.entries(players).find(
        ([_, p]) => p.id === playerId
      );
      if (!oldEntry) return;

      const [oldSocketId, playerData] = oldEntry;

      delete players[oldSocketId];
      players[socket.id] = { ...playerData, socketId: socket.id };

      await matchInitial.updateMatch(roomId, { players });

      socket.join(roomId);
    });


    // --------------------------
    // LÓGICA DO JOGO (exemplo)
    // --------------------------
    socket.on('opcoesCarta', async ({ roomId, idcarta }) => {
      const match = await matchInitial.getMatch(roomId);
      if (!match) return;

      const players = match.players;
      const state = match.state;

      const playerData = players[socket.id];
      if (!playerData) return;

      const role = playerData.role;

      let newState = matchInitial.descelecionaCartas({ players, state });
      newState = matchInitial.opcoesCarta({ players, state: newState }, role, idcarta);

      await matchInitial.updateMatch(roomId, { state: newState });

      io.to(roomId).emit('stateUpdate', {
        roomId,
        state: newState,
        players
      });
    });


    socket.on('turnChange', async ({ roomId }) => {
      const match = await matchInitial.getMatch(roomId);
      if (!match) return;

      const newState = matchInitial.turnChange({
        players: match.players,
        state: match.state
      });

      await matchInitial.updateMatch(roomId, { state: newState });

      io.to(roomId).emit('stateUpdate', newState);
    });



    socket.on('espacosDisponiveis', async ({ roomId, idcarta, movement, attack, role }) => {
      const match = await matchInitial.getMatch(roomId);
      if (!match) return;


      let newState = matchInitial.descelecionaCartas(match);
      newState = matchAttack[attack](match, role, idcarta);
      newState = matchMoviment[movement](match, role, idcarta);

      await matchInitial.updateMatch(roomId, { state: newState });

      io.to(roomId).emit('stateUpdate', newState);
    });

    socket.on('movimentaCarta', async({roomId, idcarta, idespaco, role}) => {
    const match = await matchInitial.getMatch(roomId);
      if (!match) return;

    let newState = matchInitial.movimentaCarta(match, role, idcarta, idespaco);

    await matchInitial.updateMatch(roomId, { state: newState });

    io.to(roomId).emit('stateUpdate', newState);
  });

  socket.on('danificaCarta', async({roomId, idcarta, idespaco, role}) => {
    const match = await matchInitial.getMatch(roomId);
      if (!match) return;

    let newState = matchInitial.danificaCarta(match, idcarta, idespaco, role);

    await matchInitial.updateMatch(roomId, { state: newState });

    io.to(roomId).emit('stateUpdate', newState);
  });

  socket.on('desselecionaCarta', async({roomId}) => {
    const match = await matchInitial.getMatch(roomId);
      if (!match) return;

    let newState = matchInitial.descelecionaCartas(match);

    io.to(roomId).emit('stateUpdate', newState);
  });


    socket.on('disconnect', () => {
      if (waitingPlayer && waitingPlayer.id === socket.id) {
        waitingPlayer = null;
      }
    });

  });
};