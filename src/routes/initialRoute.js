const express = require('express');
const router = express.Router();

const initialController = require('../controllers/initialController');

router.get('/', initialController.login);
router.get('/register', initialController.cadastro);

module.exports = router;