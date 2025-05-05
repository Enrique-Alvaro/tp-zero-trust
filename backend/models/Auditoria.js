const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Auditoria = sequelize.define('Auditoria', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Auditoria;