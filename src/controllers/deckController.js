// controllers/baralhoController.js
const Baralho = require('../models/deckModel');
const { v4: uuidv4 } = require('uuid');

async function criarBaralho(req, res) {
  try {
    const novoBaralho = await Baralho.create({
      id_deck: uuidv4(),
      id_user: req.body.id_usuario
    });
    res.status(201).json(novoBaralho);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listarBaralhos(req, res) {
  try {
    const baralhos = await Baralho.findAll({
      order: [['id_baralho', 'ASC']]
    });
    res.status(200).json(baralhos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletarBaralho(req, res) {
  try {
    const { id } = req.params;
    const deletado = await Baralho.destroy({
      where: { id_baralho: id }
    });
    if (deletado) {
      res.status(200).json({ message: 'Baralho deletado com sucesso' });
    } else {
      res.status(404).json({ message: 'Baralho não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { 
    criarBaralho,
    listarBaralhos,
    deletarBaralho,
};