// Base de Dados
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Baralho = sequelize.define('deck', {
  id_deck: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  id_user: {
    type: DataTypes.UUID,
    allowNull: false,
  },
   deck: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  color: {
    type: DataTypes.TEXT,
    allowNull: true
  },
    name: {
      type: DataTypes.STRING(25),
      allowNull: true
  },
}, {
  tableName: 'deck',
  timestamps: false // Desative se sua tabela não tiver createdAt/updatedAt
});

module.exports = Baralho;