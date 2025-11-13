const baralhoModel = require('../models/matchModel');
const path = require('path');

const login = (req, res) => {
    res.render(path.join(__dirname, '..', 'view', 'login.ejs'), {message: null})
};

const cadastro = (req, res) => {
    res.render(path.join(__dirname, '..', 'view', 'register.ejs'), {message: null})
};


module.exports = {
   login,
   cadastro,
};