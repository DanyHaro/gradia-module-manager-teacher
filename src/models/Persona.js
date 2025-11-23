// src/models/Persona.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo de Persona - READ ONLY
 * Se conecta a 'mantenimiento_usuarios.persona'
 */
const Persona = sequelize.define('Persona', {
    id_persona: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_persona'
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nombre'
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'apellido'
    }
}, {
    tableName: 'persona',
    schema: 'mantenimiento_usuarios',
    timestamps: true,
    underscored: true,
    paranoid: true
});

module.exports = Persona;
