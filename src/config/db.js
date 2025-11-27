// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'CNT45cn30ivm24v0', {
  host: '100.83.58.127',
  dialect: 'postgres',
  port: 5432
});


module.exports = sequelize;
///postgres://postgres:CNT45cn30ivm24v0@localhost:5432/postgres