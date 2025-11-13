const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');

exports.createUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.create({
      id: uuidv4(),
      username: name,
      password: password 
    });
    res.render(path.join(__dirname, '..', 'view', 'mainScreen.ejs'), {user})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.render(path.join(__dirname, '..', 'view', 'login.ejs'), {message: 'Usuário não encontrado'});

    //const valid = await bcrypt.compare(password, user.password);
    //if (!valid) return res.render(path.join(__dirname, '..', 'view', 'login.ejs'), {message: 'Senha incorreta'});
    if(password === user.password){
      res.render(path.join(__dirname, '..', 'view', 'mainScreen.ejs'), {user});
    }else{
      res.render(path.join(__dirname, '..', 'view', 'login.ejs'), {message: 'Senha incorreta'});
    }
  } catch (error) {
    res.status(500).send('Erro ao fazer login: ' + error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // ID da URL
    const { nome, email } = req.body; // dados do corpo da requisição

    // Tenta atualizar o registro
    const [updated] = await User.update(
      { nome, email },
      { where: { id } }
    );

    if (updated) {
      const updatedUser = await User.findByPk(id);
      return res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: updatedUser });
    }

    return res.status(404).json({ message: 'Usuário não encontrado.' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};