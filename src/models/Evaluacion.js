// src/models/Evaluacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evaluacion = sequelize.define('Evaluacion', {
    id_evaluacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_evaluacion'
    },
    id_entrega: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_entrega'
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_usuario'
    },
    puntaje_total: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'puntaje_total'
    },
    feedback_general: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'feedback_general'
    },
    fecha_evaluacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'fecha_evaluacion'
    }
}, {
    tableName: 'evaluacion',
    schema: 'evaluaciones',
    timestamps: false
});

module.exports = Evaluacion;