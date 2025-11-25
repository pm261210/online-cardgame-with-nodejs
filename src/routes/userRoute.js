const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Definir as rotas
router.get('/all', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.get('/main/:id', UserController.mainscreen);
router.post('/register', UserController.createUser);
router.post('/update/:id', UserController.updateUser);
router.post('/login', UserController.loginUser);

module.exports = router;