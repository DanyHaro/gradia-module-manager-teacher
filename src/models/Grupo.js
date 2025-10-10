const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grupo = sequelize.define('Grupo', {
  id_grupo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_grupo'
  },
  nombre_grupo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre_grupo'
  },
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_actividad'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'grupo',
  schema: 'grupos',
  timestamps: false
});

module.exports = Grupo;
