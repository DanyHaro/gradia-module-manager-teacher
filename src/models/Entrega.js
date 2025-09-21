// src/models/Entrega.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entrega = sequelize.define('Entrega', {
  id_entrega: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_entrega'
  },
  fecha_entrega: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_entrega'
  },
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_actividad'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null si es entrega grupal
    field: 'id_usuario'
  },
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null si es entrega individual
    field: 'id_grupo'
  },
  num_intento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'num_intento'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'entrega',
  schema: 'actividades',
  timestamps: false
});

module.exports = Entrega;