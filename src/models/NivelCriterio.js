// src/models/NivelCriterio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NivelCriterio = sequelize.define('NivelCriterio', {
    id_nivel_criterio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_nivel_criterio'
    },
    id_rubrica_criterio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_rubrica_criterio'
    },
    nombre_nivel: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nombre_nivel'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'descripcion'
    },
    puntaje_asignado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'puntaje_asignado'
    },
    orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'orden'
    }
}, {
    tableName: 'nivel_criterio',
    schema: 'evaluaciones',
    timestamps: false
});

module.exports = NivelCriterio;