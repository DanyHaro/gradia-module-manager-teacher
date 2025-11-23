// src/models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo de Usuario - READ ONLY
 * Este modelo se conecta a la tabla 'mantenimiento_usuarios.usuarios'
 * que es compartida con el backend de autenticación (auth_gradia)
 * 
 * IMPORTANTE: Solo se usa para lectura, NO para modificar usuarios
 */
const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_usuario'
    },
    correo_institucional: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        field: 'correo_institucional'
    },
    id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_persona'
    }
}, {
    tableName: 'usuario',
    schema: 'mantenimiento_usuarios',
    timestamps: true,
    underscored: true,
    paranoid: true
});

module.exports = Usuario;
