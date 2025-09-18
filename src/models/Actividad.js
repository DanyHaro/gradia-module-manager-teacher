// src/models/Actividad.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Actividad = sequelize.define('Actividad', {
  id_actividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_actividad'
  },
  nombre_actividad: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'nombre_actividad'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  },
  fecha_limite: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_limite'
  },
  tipo_actividad: {
    type: DataTypes.ENUM('individual', 'grupal'),
    allowNull: false,
    field: 'tipo_actividad'
  },
  id_sesion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_sesion'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  id_rubrica: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_rubrica'
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
  tableName: 'actividad',
  schema: 'actividades',
  timestamps: false
});

module.exports = Actividad;