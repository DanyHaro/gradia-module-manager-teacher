// src/models/Criterio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Criterio = sequelize.define('Criterio', {
    id_criterio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_criterio'
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'nombre'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'descripcion'
    }
}, {
    tableName: 'criterio',
    schema: 'evaluaciones',
    timestamps: false
});

module.exports = Criterio;