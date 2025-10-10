// src/models/RubricaCriterio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RubricaCriterio = sequelize.define('RubricaCriterio', {
    id_rubrica_criterio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_rubrica_criterio'
    },
    id_rubrica: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_rubrica'
    },
    id_criterio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_criterio'
    },
    peso: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1.0,
        field: 'peso'
    },
    puntaje_maximo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'puntaje_maximo'
    },
    orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'orden'
    }
}, {
    tableName: 'rubrica_criterio',
    schema: 'evaluaciones',
    timestamps: false
});

module.exports = RubricaCriterio;