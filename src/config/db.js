// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:CNT45cn30ivm24v0@localhost:5432/postgres', {
  dialect: 'postgres',
  logging: false,
});


module.exports = sequelize;