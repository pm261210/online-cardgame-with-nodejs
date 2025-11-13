const express = require('express');
const router = express.Router();

const matchController = require('../controllers/matchController');

router.get('/:id', matchController.comecaPartida);


module.exports = router;