// Base de Dados


 // Match begin
 const serializePlayers = (playersMap)  => {
    const result = {};
    for (const socketId in playersMap) {
      const { id, role } = playersMap[socketId];
      result[id] = role;
    }
    return result;
 };



const createInitialGameState = () => {
  deck1 = generateDeck('player1');
  deck2 = generateDeck('player2');
  mao1 = generateHand(deck1);
  mao2 = generateHand(deck2);
  return {
    player1: {
      deck: deck1,
      hand: mao1,
      summon: 1,
      discardpile: [],
    },
    player2: {
      deck: deck2,
      hand: mao2,
      summon: 1,
      discardpile: [],
    },
    turnplayer: generateTurnPlayer(),
    turn: 1,
    campo: generateField(),
  };
}

const generateHand = (deck) => {
  const hand = [];
  for (let i = 0; i < 5; i++) {
    carta = deck.splice(i, 1)[0]
    hand.push(carta);
  }
  return hand;
}

const generateDeck = (player) => {
  const deck = [];
  if(player == 'player1'){
    for (let i = 0; i < 40; i++) {
      deck.push({ id: i, owner: player, card:{id: 10, name: 'monstro', range: 1, attack: 1, hp: 3, currenthp: 3, movement: 1, currentattack: 1, currentrange: 1, movementquant: 1, attackquant: 0, movementfun: 'movement1', attackfun: 'attack1'}});
    }
  }else{
    for (let i = 40; i < 80; i++) {
      deck.push({ id: i, owner: player, card:{id: 10, name: 'monstro', range: 1, attack: 1, hp: 3, currenthp: 3, movement: 1, currentattack: 1, currentrange: 1, movementquant: 1, attackquant: 0, movementfun: 'movement1', attackfun: 'attack1'}});
    }
  }
  let ncartas = deck.length, j, temp;
  while(--ncartas > 0){
    j = Math.floor(Math.random() * (ncartas+1));
    temp = deck[j];
    deck[j] = deck[ncartas];
    deck[ncartas] = temp;
  }
  return deck;
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
// Turn change

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
    match.state['campo'].forEach(r => {
      r.forEach(c => {
        delete c.disponivel
        delete c.carta
        delete c.attacable
        let idcartacampo = c.content.findIndex(i => i.id == idcarta);
        if(idcartacampo != -1){
          const cartaselecionadacampo = c.content.splice(idcartacampo, 1)[0];
          delete cartaselecionadacampo.selecionado
          cartaselecionadacampo.card.movementquant -= 1;
          match.state['campo'][(parseInt(idespaco[0])-1)][parseInt(idespaco[1])-1].content.push(cartaselecionadacampo);
        }
      });
    });
    let idcartamao = match.state[role].hand.findIndex(c => c.id == idcarta);
    if(idcartamao != -1){
      const cartaselecionada = match.state[role].hand.splice(idcartamao, 1)[0];
      delete cartaselecionada.selecionado
      match.state['campo'][(parseInt(idespaco[0])-1)][parseInt(idespaco[1])-1].content.push(cartaselecionada);
      match.state[role].summon -= 1;
    }
  return match.state
}

const attack1 = (match, role, idcarta) => {
  let enemy = null;
  if(role == 'player1'){
    enemy = 'player2';
  }else{
    enemy = 'player1';
  }
  match.state['campo'].forEach(r => {
      r.forEach(c => {
        if(c.content[0]?.id == idcarta){
          c.content[0].selecionado == true;
          const row = parseInt(String(c.id)[0])-1;
          const collum = parseInt(String(c.id)[1])-1;
          if(match.state['campo'][row]?.[collum-1]?.content?.[0]?.owner == enemy){
            match.state['campo'][row][collum-1].attacable = true;
            match.state['campo'][row][collum-1].carta = idcarta;
          }
          if(match.state['campo'][row-1]?.[collum]?.content?.[0]?.owner == enemy){
            match.state['campo'][row-1][collum].attacable = true;
            match.state['campo'][row-1][collum].carta = idcarta;
          }
          if(match.state['campo'][row]?.[collum+1]?.content?.[0]?.owner == enemy){
            match.state['campo'][row][collum+1].attacable = true;
            match.state['campo'][row][collum+1].carta = idcarta;
          }
          if(match.state['campo'][row+1]?.[collum]?.content?.[0]?.owner == enemy){
            match.state['campo'][row+1][collum].attacable = true;
            match.state['campo'][row+1][collum].carta = idcarta;
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
  match.state['campo'].forEach(r => {
      r.forEach(c => {
        delete c.disponivel
        delete c.carta
        delete c.attacable
        let idcartacampo = c.content.findIndex(i => i.id == idcarta);
        if(idcartacampo != -1){
          dano = c.content[0].card.currentattack
          delete c.content[0].selecionado
          c.content[0].card.movementquant -= 1;
          c.content[0].card.attackquant -= 1;
        }
      });
    });
  match.state['campo'].forEach(r => {
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
  }else{
    match.state.turnplayer = 'player1'
    match.state.player1.summon = 1;
  }

  match.state['campo'].forEach(r => {
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

const desselecionaAtaques = (match) => {
  match.state.campo.forEach(r => {
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
  match.state.campo.forEach(r => {
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
  match.state.campo.forEach(r => {
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
    serializePlayers,
    createInitialGameState,
    opcoesCarta,
    descelecionaCartas,
    movement1,
    movement2,
    attack1,
    movimentaCarta,
    danificaCarta,
    turnChange,
 }
 