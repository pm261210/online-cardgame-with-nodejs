const baralhoModel = require('../models/matchModel');
const User = require('../models/userModel');
const path = require('path');

const filadeespera = async(req, res) => {
    const user = await User.findByPk(req.params.id);
    res.render(path.join(__dirname, '..', 'view', 'multiplayer.ejs'), {user: user});
};

module.exports = {
   filadeespera
};