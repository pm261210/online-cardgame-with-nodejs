


const attack1 = (match, role, idcarta) => {
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

module.exports = {
  attack1,
  attack2,
};