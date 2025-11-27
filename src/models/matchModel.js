// Base de Dados
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Matches = sequelize.define('match', {
  roomId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
   players: {
    type: DataTypes.JSON,
    allowNull: true,
  },
   state: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'matches',
  timestamps: false // Desative se sua tabela não tiver createdAt/updatedAt
});

module.exports = Matches;