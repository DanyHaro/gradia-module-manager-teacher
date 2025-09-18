// src/models/Sesion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Unidad = require('./Unidad');

const Sesion = sequelize.define('Sesion', {
  id_sesion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_sesion'
  },
  titulo_sesion: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'titulo_sesion'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  },
  numero_sesion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'numero_sesion'
  },
  fecha_sesion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fecha_sesion'
  },
  id_unidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_unidad',
    references: {
      model: Unidad,
      key: 'id_unidad'
    }
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
  tableName: 'sesion',
  schema: 'cursos',
  timestamps: false
});

// Las relaciones se definen en un archivo separado

module.exports = Sesion;