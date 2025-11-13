const express = require('express');
const router = express.Router();

const socketController = require('../controllers/filaController');

router.get('/', socketController.filadeespera);

module.exports = router;