// src/models/DetalleEvaluacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleEvaluacion = sequelize.define('DetalleEvaluacion', {
    id_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_detalle'
    },
    id_evaluacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_evaluacion'
    },
    id_rubrica_criterio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_rubrica_criterio'
    },
    id_nivel_criterio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_nivel_criterio'
    },
    puntaje_obtenido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'puntaje_obtenido'
    },
    feedback_especifico: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'feedback_especifico'
    }
}, {
    tableName: 'detalle_evaluacion',
    schema: 'evaluaciones',
    timestamps: false
});

module.exports = DetalleEvaluacion;