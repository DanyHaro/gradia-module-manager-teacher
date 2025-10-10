const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaterialActividad = sequelize.define('MaterialActividad', {
  id_documento_actividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_documento_actividad'
  },
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_actividad'
  },
  nombre_documento: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'nombre_documento'
  },
  tipo_documento: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'tipo_documento'
  },
  url_archivo: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'url_archivo'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'documento_actividad',
  schema: 'actividades',
  timestamps: false
});

module.exports = MaterialActividad;
