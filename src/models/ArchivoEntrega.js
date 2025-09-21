// src/models/ArchivoEntrega.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArchivoEntrega = sequelize.define('ArchivoEntrega', {
  id_archivo_entrega: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_archivo_entrega'
  },
  id_entrega: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_entrega'
  },
  nombre_archivo: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'nombre_archivo'
  },
  tipo_archivo: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'tipo_archivo'
  },
  url_archivo: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'url_archivo'
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'version'
  },
  hash_contenido: {
    type: DataTypes.STRING(64),
    allowNull: true,
    field: 'hash_contenido'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'archivo_entrega',
  schema: 'actividades',
  timestamps: false
});

module.exports = ArchivoEntrega;