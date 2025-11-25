// controllers/baralhoController.js
const Baralho = require('../models/deckModel');
const Carta = require('../models/cardModel');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

async function criarBaralho(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    const novoBaralho = await Baralho.create({
      id_deck: uuidv4(),
      id_user: req.params.id,
      deck: [],
      color: 'vermelhoescuro',
      name: 'new deck',
    });
    const baralhos = await Baralho.findAll({
      order: [['name', 'ASC']],
      where: {
        id_user: req.params.id
    }
    });
    res.render(path.join(__dirname, '..', 'view', 'userdecks.ejs'), {user, baralhos});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listarBaralhos(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    const baralhos = await Baralho.findAll({
      order: [['name', 'ASC']],
      where: {
        id_user: req.params.id
    }
    });
    res.render(path.join(__dirname, '..', 'view', 'userdecks.ejs'), {user, baralhos});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function editarBaralho(req, res) {
  try {
    const user = await User.findByPk(req.params.iduser);
    const baralho = await Baralho.findByPk(req.params.id);
    const cards = await Carta.findAll();
    res.render(path.join(__dirname, '..', 'view', 'editdeck.ejs'), {user, baralho, cards});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletarBaralho(req, res) {
  try {
    const { id, iduser } = req.params;
    const deletado = await Baralho.destroy({
      where: { id_deck: id }
    });
    if (deletado) {
      const user = await User.findByPk(iduser);
      if(user.selectedDeck == id){
            console.log('BBBBBB: '+iduser);
        const [quantidadeDeLinhasAtualizadas] = await User.update(
          { 
          selectedDeck: null
          },
          {
            where: {
              id:  iduser, // Condição para localizar o deck específico
            }
          }
        );
      }
      
      res.status(200).json({ message: 'Baralho deletado com sucesso' });
    } else {
      res.status(404).json({ message: 'Baralho não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function atualizarDeck(req, res){
  try {
    const { id_deck } = req.params;
    const { name, deck, color } = req.body;
    const [quantidadeDeLinhasAtualizadas] = await Baralho.update(
      { 
       deck: deck , // Novos valores
       name: name ,
       color: color 
      },
      {
        where: {
          id_deck:  id_deck , // Condição para localizar o deck específico
        }
      }
    );

    if (quantidadeDeLinhasAtualizadas > 0) {
      res.status(200).json({ message: 'Deck atualizado com sucesso!' });
    } else {
      res.status(404).json({ message: 'Baralho não encontrado' });
    }
  } catch (erro) {
    console.error('Erro ao atualizar deck:', erro);
  }
};




async function criarCarta(req, res) {
  try {
    const carta = {name: req.body.cardname, class: req.body.cardclass, type: req.body.cardtype, image: req.body.cardimg, level: req.body.cardlv, atk: req.body.cardatk, hp: req.body.cardhp, movefun: req.body.cardmove, atkfun: req.body.cardrange}
    const novoBaralho = await Carta.create({
      id_card: uuidv4(),
      card: carta
    });
    res.render(path.join(__dirname, '..', 'view', 'createcard.ejs'), {message: null})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCards(req, res) {
  try {
    const cards = await Carta.findAll();
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar cards' });
  }
};


function addcard(req, res) {
  res.render(path.join(__dirname, '..', 'view', 'createcard.ejs'), {message: null})
}

module.exports = { 
    atualizarDeck,
    criarBaralho,
    listarBaralhos,
    editarBaralho,
    deletarBaralho,
    criarCarta,
    getCards,
    addcard,
};