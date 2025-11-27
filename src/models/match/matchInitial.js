const  Matches  = require('../matchModel');
const  User  = require('../userModel');
const  Baralho  = require('../deckModel');
const  Carta  = require('../cardModel');

async function createMatch(roomId, players, state) {
  return await Matches.create({
    roomId,
    players,
    state
  });
}

async function getMatch(roomId) {
  return await Matches.findByPk(roomId);
}

async function updateMatch(roomId, newData) {
  return await Matches.update(newData, {
    where: { roomId }
  });
}

async function deleteMatch(roomId) {
  return await Matches.destroy({ where: { roomId } });
}

async function createInitialGameState(player1, player2) {
  const user1 = await User.findByPk(player1);
  const user2 = await User.findByPk(player2);

  const finddeck1 = await Baralho.findByPk(user1.selectedDeck);
  const fienddeck2 = await Baralho.findByPk(user2.selectedDeck);

  const deck1 = await generateDeck(finddeck1,'player1');
  const deck2 = await generateDeck(fienddeck2,'player2');

  mao1 = generateHand(deck1);
  mao2 = generateHand(deck2);
  return {
    player1: {
      deck: deck1,
      hand: mao1,
      summon: 1,
      lp: 10,
      discardpile: [],
    },
    player2: {
      deck: deck2,
      hand: mao2,
      summon: 1,
      lp: 10,
      discardpile: [],
    },
    turnplayer: generateTurnPlayer(),
    turn: 1,
    field: generateField(),
  };

}

const generateField = () => {
  const field = [];
  for (let i = 0; i < 5; i++) {
    let fieldcollum = [];
    for (let c = 0; c < 5; c++) {

      fieldcollum.push({ id: (i+1)*10+(c+1), content: []});
    }
    field.push(fieldcollum);
  }
  return field;
}

const generateHand = (deck) => {
  const hand = [];
  for (let i = 0; i < 5; i++) {
    let carta = deck.splice(i, 1)[0]
    hand.push(carta);
  }
  return hand;
}

const generateDeck = async (playerdeck, player)  =>  {
  const deck = [];

  for (const card of playerdeck.deck) {
    const carta = await Carta.findByPk(card.id);
    console.log(carta.card);
    deck.push({id: card.slot, owner: player, card:{id: card.id, name: carta.card.name, img: carta.card.image, level: carta.card.level, class: carta.card.class, atk: carta.card.atk, hp: carta.card.hp, currenthp: carta.card.hp, currentatk: carta.card.atk, movementquant: 1, atkquant: 0, movementfun: carta.card.movefun, atkfun: carta.card.atkfun}})
  };
  let ncartas = deck.length, j, temp;
  while(--ncartas > 0){
    j = Math.floor(Math.random() * (ncartas+1));
    temp = deck[j];
    deck[j] = deck[ncartas];
    deck[ncartas] = temp;
  }
  return deck;
}

const generateTurnPlayer = () => {
  const randon = Math.floor(Math.random() * (2));
  if(randon == 1){
    return 'player1'
  }else{
    return 'player2'
  }
}

const opcoesCarta = (match, role, idcarta) => {
    match.state[role].hand.forEach(element => {
      if(element.id == idcarta && match.state[role].summon > 0){
        element.opcoes = true;
      }
    });
  return match.state
}

// Movement
const movement1 = (match, role, idcarta) => {
    match.state[role].hand.forEach(element => {
      if(element.id == idcarta){
        delete element.opcoes;
        element.selecionado = true;
        if(role == 'player1'){
          match.state['field'][4].forEach(c => {
            if(c.content.length == 0){
              c.disponivel = true;
              c.carta = idcarta;
            }
          });
        }else{
          match.state['field'][0].forEach(c => {
              if(c.content.length == 0){
                c.disponivel = true;
                c.carta = idcarta;
              }
          });
        }
      }else{
        delete element.opcoes;
        delete element.selecionado;
      }
    });

    match.state['field'].forEach(r => {
      r.forEach(c => {
        if(c.content[0]?.id == idcarta){
          c.content[0].selecionado == true;
          const row = parseInt(String(c.id)[0])-1;
          const collum = parseInt(String(c.id)[1])-1;
          if(match.state['field'][row]?.[collum-1]?.content?.length === 0){
            match.state['field'][row][collum-1].disponivel = true;
            match.state['field'][row][collum-1].carta = idcarta;
          }
          if(match.state['field'][row-1]?.[collum]?.content?.length === 0){
            match.state['field'][row-1][collum].disponivel = true;
            match.state['field'][row-1][collum].carta = idcarta;
          }
          if(match.state['field'][row]?.[collum+1]?.content?.length === 0){
            match.state['field'][row][collum+1].disponivel = true;
            match.state['field'][row][collum+1].carta = idcarta;
          }
          if(match.state['field'][row+1]?.[collum]?.content?.length === 0){
            match.state['field'][row+1][collum].disponivel = true;
            match.state['field'][row+1][collum].carta = idcarta;
          }

          //sem movimentos
          if(c.content[0].card.movementquant <= 0){
            match.state = desselecionaMovimentos(match);
            return match.state
          }
        }
      });
    });
  return match.state
}

const movement2 = (match, role, idcarta) => {
    match.state[role].hand.forEach(element => {
      if(element.id == idcarta){
        delete element.opcoes;
        element.selecionado = true;
        if(role == 'player1'){
          match.state['campo'][4].forEach(c => {
            if(c.content.length == 0){
              c.disponivel = true;
              c.carta = idcarta;
            }
          });
        }else{
          match.state['campo'][0].forEach(c => {
              if(c.content.length == 0){
                c.disponivel = true;
                c.carta = idcarta;
              }
          });
        }
      }else{
        delete element.opcoes;
        delete element.selecionado;
      }
    });

    match.state['campo'].forEach(r => {
      r.forEach(c => {
        if(c.content[0]?.id == idcarta){
          c.content[0].selecionado == true;
          const row = parseInt(String(c.id)[0])-1;
          const collum = parseInt(String(c.id)[1])-1;
          if(match.state['campo'][row]?.[collum-1]?.content?.length === 0){
            match.state['campo'][row][collum-1].disponivel = true;
            match.state['campo'][row][collum-1].carta = idcarta;
          }
          if(match.state['campo'][row-1]?.[collum]?.content?.length === 0){
            match.state['campo'][row-1][collum].disponivel = true;
            match.state['campo'][row-1][collum].carta = idcarta;
          }
          if(match.state['campo'][row]?.[collum+1]?.content?.length === 0){
            match.state['campo'][row][collum+1].disponivel = true;
            match.state['campo'][row][collum+1].carta = idcarta;
          }
          if(match.state['campo'][row+1]?.[collum]?.content?.length === 0){
            match.state['campo'][row+1][collum].disponivel = true;
            match.state['campo'][row+1][collum].carta = idcarta;
          }
          if(match.state['campo'][row]?.[collum-2]?.content?.length === 0 && match.state['campo'][row]?.[collum-1]?.content?.length === 0){
            match.state['campo'][row][collum-2].disponivel = true;
            match.state['campo'][row][collum-2].carta = idcarta;
          }
          if(match.state['campo'][row-2]?.[collum]?.content?.length === 0 && match.state['campo'][row-1]?.[collum]?.content?.length === 0){
            match.state['campo'][row-2][collum].disponivel = true;
            match.state['campo'][row-2][collum].carta = idcarta;
          }
          if(match.state['campo'][row]?.[collum+2]?.content?.length === 0 && match.state['campo'][row]?.[collum+1]?.content?.length === 0){
            match.state['campo'][row][collum+2].disponivel = true;
            match.state['campo'][row][collum+2].carta = idcarta;
          }
          if(match.state['campo'][row+2]?.[collum]?.content?.length === 0 && match.state['campo'][row+1]?.[collum]?.content?.length === 0){
            match.state['campo'][row+2][collum].disponivel = true;
            match.state['campo'][row+2][collum].carta = idcarta;
          }
          if(match.state['campo'][row-1]?.[collum-1]?.content?.length === 0){
            match.state['campo'][row-1][collum-1].disponivel = true;
            match.state['campo'][row-1][collum-1].carta = idcarta;
          }
          if(match.state['campo'][row-1]?.[collum+1]?.content?.length === 0){
            match.state['campo'][row-1][collum+1].disponivel = true;
            match.state['campo'][row-1][collum+1].carta = idcarta;
          }
          if(match.state['campo'][row+1]?.[collum-1]?.content?.length === 0){
            match.state['campo'][row+1][collum-1].disponivel = true;
            match.state['campo'][row+1][collum-1].carta = idcarta;
          }
          if(match.state['campo'][row+1]?.[collum+1]?.content?.length === 0){
            match.state['campo'][row+1][collum+1].disponivel = true;
            match.state['campo'][row+1][collum+1].carta = idcarta;
          }

          //sem movimentos
          if(c.content[0].card.movementquant <= 0){
            match.state = desselecionaMovimentos(match);
            return match.state
          }
        }
      });
    });
  return match.state
}

const movimentaCarta = (match, role, idcarta, idespaco) => {
    match.state['field'].forEach(r => {
      r.forEach(c => {
        delete c.disponivel
        delete c.carta
        delete c.attacable
        let idcartacampo = c.content.findIndex(i => i.id == idcarta);
        if(idcartacampo != -1){
          const cartaselecionadacampo = c.content.splice(idcartacampo, 1)[0];
          delete cartaselecionadacampo.selecionado
          cartaselecionadacampo.card.movementquant -= 1;
          match.state['field'][(parseInt(idespaco[0])-1)][parseInt(idespaco[1])-1].content.push(cartaselecionadacampo);
        }
      });
    });
    let idcartamao = match.state[role].hand.findIndex(c => c.id == idcarta);
    if(idcartamao != -1){
      const cartaselecionada = match.state[role].hand.splice(idcartamao, 1)[0];
      delete cartaselecionada.selecionado
      match.state['field'][(parseInt(idespaco[0])-1)][parseInt(idespaco[1])-1].content.push(cartaselecionada);
      match.state[role].summon -= 1;
    }
  return match.state
}

const attack2 = (match, role, idcarta) => {
  let enemy = null;
  if(role == 'player1'){
    enemy = 'player2';
  }else{
    enemy = 'player1';
  }
  match.state['field'].forEach(r => {
      r.forEach(c => {
        if(c.content[0]?.id == idcarta){
          c.content[0].selecionado == true;
          const row = parseInt(String(c.id)[0])-1;
          const collum = parseInt(String(c.id)[1])-1;
          if(match.state['field'][row]?.[collum-1]?.content?.[0]?.owner == enemy){
            match.state['field'][row][collum-1].attacable = true;
            match.state['field'][row][collum-1].carta = idcarta;
          }
          if(match.state['field'][row-1]?.[collum]?.content?.[0]?.owner == enemy){
            match.state['field'][row-1][collum].attacable = true;
            match.state['field'][row-1][collum].carta = idcarta;
          }
          if(match.state['field'][row]?.[collum+1]?.content?.[0]?.owner == enemy){
            match.state['field'][row][collum+1].attacable = true;
            match.state['field'][row][collum+1].carta = idcarta;
          }
          if(match.state['field'][row+1]?.[collum]?.content?.[0]?.owner == enemy){
            match.state['field'][row+1][collum].attacable = true;
            match.state['field'][row+1][collum].carta = idcarta;
          }

          //sem ataques
          if(c.content[0].card.attackquant <= 0){
            match.state = desselecionaAtaques(match);
            return match.state
          }
        }
      });
    });
  return match.state
}

const danificaCarta = (match, idcarta, idespaco, role) => {
  let dano = null
  match.state['field'].forEach(r => {
      r.forEach(c => {
        delete c.disponivel
        delete c.carta
        delete c.attacable
        let idcartacampo = c.content.findIndex(i => i.id == idcarta);
        if(idcartacampo != -1){
          dano = c.content[0].card.currentatk
          delete c.content[0].selecionado
          c.content[0].card.movementquant -= 1;
          c.content[0].card.attackquant -= 1;
        }
      });
    });
  match.state['field'].forEach(r => {
      r.forEach(c => {
        if(c.id == idespaco && c.content.length != 0){
          c.content[0].card.currenthp = c.content[0].card.currenthp - dano
          if(c.content[0].card.currenthp <= 0){
            const cartacampo = c.content.splice(0, 1)[0];
            match.state[cartacampo.owner].discardpile.push(cartacampo);
          }
        }
      });
    });
  return match.state
}

const turnChange = (match) => {
  if(match.state.turnplayer == 'player1'){
    match.state.turnplayer = 'player2'
    match.state.player2.summon = 1;
    match = drawCard('player2', match);
  }else{
    match.state.turnplayer = 'player1'
    match.state.player1.summon = 1;
    match = drawCard('player1', match);
  }

  match.state['field'].forEach(r => {
      r.forEach(c => {
        if(c.content[0]?.owner == match.state.turnplayer){
          c.content[0].card.movementquant = 1;
          c.content[0].card.attackquant = 1;
        }
      });
    });
  match.state.turn += 1;
  
  return match.state
}

const drawCard = (player, match) => {
    let carta = match.state[player].deck.splice(0, 1)[0];
    match.state[player].hand.push(carta);
    return match
}

const desselecionaAtaques = (match) => {
  match.state.field.forEach(r => {
    r.forEach(c => {
      if(c.attacable != undefined){
        delete c.carta;
        delete c.attacable;
      }
    });
  });

  match.state.player1.hand.forEach(element => {
      delete element.opcoes;
      delete element.selecionado;
  });

  match.state.player2.hand.forEach(element => {
      delete element.opcoes;
      delete element.selecionado;
  });
  return match.state
}

const desselecionaMovimentos = (match) => {
  match.state.field.forEach(r => {
    r.forEach(c => {
      if(c.disponivel != undefined){
        delete c.carta;
        delete c.disponivel;
      }
    });
  });

  match.state.player1.hand.forEach(element => {
      delete element.opcoes;
      delete element.selecionado;
  });

  match.state.player2.hand.forEach(element => {
      delete element.opcoes;
      delete element.selecionado;
  });
  return match.state
}

const descelecionaCartas = (match) => {
  match.state.field.forEach(r => {
    r.forEach(c => {
        delete c.disponivel;
        delete c.carta;
        delete c.attacable;
        delete c.content[0]?.selecionado;
    });
  });

  match.state.player1.hand.forEach(element => {
      delete element.opcoes;
      delete element.selecionado;
  });

  match.state.player2.hand.forEach(element => {
      delete element.opcoes;
      delete element.selecionado;
  });
  return match.state
}


module.exports = {
  createMatch,
  getMatch,
  updateMatch,
  deleteMatch,
  createInitialGameState,
  descelecionaCartas,
  opcoesCarta,
  movement1,
  attack2,
  movimentaCarta,
  turnChange,
  danificaCarta,
};