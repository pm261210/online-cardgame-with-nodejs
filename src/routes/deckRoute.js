// routes/baralhoRoute.js
const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deckController');

router.get('/newdeck/:id', deckController.criarBaralho);
router.get('/id/:id/user/:iduser', deckController.editarBaralho);
router.post('/newcard', deckController.criarCarta);
router.post('/save/:id_deck', deckController.atualizarDeck);
//router.get('/', deckController.listarBaralhos);
router.get('/', deckController.addcard);
router.get('/cards', deckController.getCards);
router.get('/user/:id', deckController.listarBaralhos);
router.get('/delete/:id/user/:iduser', deckController.deletarBaralho);

module.exports = router;