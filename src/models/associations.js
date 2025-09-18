// src/models/associations.js
const Curso = require('./Curso');
const Unidad = require('./Unidad');
const Sesion = require('./Sesion');
const Actividad = require('./Actividad');

// Definir todas las relaciones aquí para evitar referencias circulares

// Curso -> Unidad
Curso.hasMany(Unidad, { 
  foreignKey: 'id_curso',
  as: 'unidades'
});

Unidad.belongsTo(Curso, { 
  foreignKey: 'id_curso',
  as: 'curso'
});

// Unidad -> Sesion
Unidad.hasMany(Sesion, { 
  foreignKey: 'id_unidad',
  as: 'sesiones'
});

Sesion.belongsTo(Unidad, { 
  foreignKey: 'id_unidad',
  as: 'unidad'
});

// Sesion -> Actividad
Sesion.hasMany(Actividad, { 
  foreignKey: 'id_sesion',
  as: 'actividades'
});

Actividad.belongsTo(Sesion, { 
  foreignKey: 'id_sesion',
  as: 'sesion'
});

module.exports = {
  Curso,
  Unidad,
  Sesion,
  Actividad
};