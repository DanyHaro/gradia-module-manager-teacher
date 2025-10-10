const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MiembroGrupo = sequelize.define('MiembroGrupo', {
  id_miembro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_miembro'
  },
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_grupo'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  rol_miembro: {
    type: DataTypes.ENUM('líder', 'integrante'),
    allowNull: false,
    defaultValue: 'integrante',
    field: 'rol_miembro'
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_ingreso'
  }
}, {
  tableName: 'miembro_grupo',
  schema: 'grupos',
  timestamps: false
});

module.exports = MiembroGrupo;
