// src/models/associations.js
const Curso = require('./Curso');
const Unidad = require('./Unidad');
const Sesion = require('./Sesion');
const Actividad = require('./Actividad');
const Entrega = require('./Entrega');
const ArchivoEntrega = require('./ArchivoEntrega');

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

// Actividad -> Entrega
Actividad.hasMany(Entrega, { 
  foreignKey: 'id_actividad',
  as: 'entregas'
});

Entrega.belongsTo(Actividad, { 
  foreignKey: 'id_actividad',
  as: 'actividad'
});

// Entrega -> ArchivoEntrega
Entrega.hasMany(ArchivoEntrega, { 
  foreignKey: 'id_entrega',
  as: 'archivos'
});

ArchivoEntrega.belongsTo(Entrega, { 
  foreignKey: 'id_entrega',
  as: 'entrega'
});

module.exports = {
  Curso,
  Unidad,
  Sesion,
  Actividad,
  Entrega,
  ArchivoEntrega
};