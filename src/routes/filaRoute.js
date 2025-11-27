const express = require('express');
const router = express.Router();

const socketController = require('../controllers/filaController');

router.get('/:id', socketController.filadeespera);

module.exports = router;