const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Definir as rotas
router.get('/all', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/resgister', UserController.createUser);
router.post('/login', UserController.loginUser);

module.exports = router;