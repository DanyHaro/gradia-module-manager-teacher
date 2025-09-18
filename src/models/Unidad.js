// models/Unidad.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Curso = require('./Curso');

const Unidad = sequelize.define('Unidad', {
  id_unidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_unidad'
  },
  titulo_unidad: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'titulo_unidad'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  },
  numero_unidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'numero_unidad'
  },
  id_curso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_curso',
    references: {
      model: Curso,
      key: 'id_curso'
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
  tableName: 'unidad',
  schema: 'cursos',
  timestamps: false
});

// Definir relaciones
Curso.hasMany(Unidad, { 
  foreignKey: 'id_curso',
  as: 'unidades'
});

Unidad.belongsTo(Curso, { 
  foreignKey: 'id_curso',
  as: 'curso'
});

module.exports = Unidad;