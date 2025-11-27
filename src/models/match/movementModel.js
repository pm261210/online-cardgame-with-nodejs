
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
          if(match.state['field'][row]?.[collum-2]?.content?.length === 0 && match.state['field'][row]?.[collum-1]?.content?.length === 0){
            match.state['field'][row][collum-2].disponivel = true;
            match.state['field'][row][collum-2].carta = idcarta;
          }
          if(match.state['field'][row-2]?.[collum]?.content?.length === 0 && match.state['field'][row-1]?.[collum]?.content?.length === 0){
            match.state['field'][row-2][collum].disponivel = true;
            match.state['field'][row-2][collum].carta = idcarta;
          }
          if(match.state['field'][row]?.[collum+2]?.content?.length === 0 && match.state['field'][row]?.[collum+1]?.content?.length === 0){
            match.state['field'][row][collum+2].disponivel = true;
            match.state['field'][row][collum+2].carta = idcarta;
          }
          if(match.state['field'][row+2]?.[collum]?.content?.length === 0 && match.state['field'][row+1]?.[collum]?.content?.length === 0){
            match.state['field'][row+2][collum].disponivel = true;
            match.state['field'][row+2][collum].carta = idcarta;
          }
          if(match.state['field'][row-1]?.[collum-1]?.content?.length === 0){
            match.state['field'][row-1][collum-1].disponivel = true;
            match.state['field'][row-1][collum-1].carta = idcarta;
          }
          if(match.state['field'][row-1]?.[collum+1]?.content?.length === 0){
            match.state['field'][row-1][collum+1].disponivel = true;
            match.state['field'][row-1][collum+1].carta = idcarta;
          }
          if(match.state['field'][row+1]?.[collum-1]?.content?.length === 0){
            match.state['field'][row+1][collum-1].disponivel = true;
            match.state['field'][row+1][collum-1].carta = idcarta;
          }
          if(match.state['field'][row+1]?.[collum+1]?.content?.length === 0){
            match.state['field'][row+1][collum+1].disponivel = true;
            match.state['field'][row+1][collum+1].carta = idcarta;
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


module.exports = {
  movement1,
  movement2,
};