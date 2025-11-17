// src/models/Inscripcion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inscripcion = sequelize.define('Inscripcion', {
  id_inscripcion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_inscripcion'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  id_curso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_curso'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'created_by'
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'updated_by'
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
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'inscripcion',
  schema: 'cursos',
  timestamps: false,
  paranoid: false // soft delete está disponible pero no automático
});

module.exports = Inscripcion;
