// routes/baralhoRoute.js
const express = require('express');
const router = express.Router();
const { criarBaralho, listarBaralhos, deletarBaralho } = require('../controllers/deckController');

router.post('/newdeck', criarBaralho);
router.get('/', listarBaralhos);
router.delete('/deleteid/:id', deletarBaralho);

module.exports = router;