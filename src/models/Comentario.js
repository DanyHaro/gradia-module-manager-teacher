const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comentario = sequelize.define('Comentario', {
  id_comentario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_comentario'
  },
  id_entrega: {
    type: DataTypes.INTEGER,
    allowNull: true, // Ahora es opcional
    field: 'id_entrega'
  },
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: true, // Comentarios pueden ser sobre actividad O entrega
    field: 'id_actividad'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'contenido'
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Para respuestas anidadas
    field: 'parent_id'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updated_at',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'comentario',
  schema: 'actividades',
  timestamps: false // Deshabilitamos timestamps automáticos pero definimos los campos manualmente
});

module.exports = Comentario;
