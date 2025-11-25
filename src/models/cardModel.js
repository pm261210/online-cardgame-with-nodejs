// Base de Dados
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Carta = sequelize.define('cards', {
  id_card: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
   card: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  tableName: 'cards',
  timestamps: false // Desative se sua tabela não tiver createdAt/updatedAt
});

module.exports = Carta;