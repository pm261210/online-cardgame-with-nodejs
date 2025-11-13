const baralhoModel = require('../models/matchModel');
const path = require('path');

const filadeespera = (req, res) => {
    res.render(path.join(__dirname, '..', 'view', 'multiplayer.ejs'));
};

module.exports = {
   filadeespera
};