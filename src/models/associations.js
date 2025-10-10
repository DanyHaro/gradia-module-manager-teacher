// src/models/associations.js
const Curso = require('./Curso');
const Unidad = require('./Unidad');
const Actividad = require('./Actividad');
const Entrega = require('./Entrega');
const ArchivoEntrega = require('./ArchivoEntrega');

// Modelos de Evaluación
const Rubrica = require('./Rubrica');
const Criterio = require('./Criterio');
const RubricaCriterio = require('./RubricaCriterio');
const NivelCriterio = require('./NivelCriterio');
const Evaluacion = require('./Evaluacion');
const DetalleEvaluacion = require('./DetalleEvaluacion');

// Modelos de Grupos
const Grupo = require('./Grupo');
const MiembroGrupo = require('./MiembroGrupo');

// Modelo de Comentarios
const Comentario = require('./Comentario');

// Modelo de Materiales (Documentos de Actividad)
const MaterialActividad = require('./MaterialUnidad');

// ========== RELACIONES EXISTENTES ==========

// Curso -> Unidad
Curso.hasMany(Unidad, {
    foreignKey: 'id_curso',
    as: 'unidades'
});
Unidad.belongsTo(Curso, {
    foreignKey: 'id_curso',
    as: 'curso'
});

// Unidad -> Actividad (relación directa sin Sesion)
Unidad.hasMany(Actividad, {
    foreignKey: 'id_unidad',
    as: 'actividades'
});
Actividad.belongsTo(Unidad, {
    foreignKey: 'id_unidad',
    as: 'unidad'
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

// ========== NUEVAS RELACIONES DE EVALUACIÓN ==========

// Actividad -> Rubrica (una actividad puede tener una rúbrica)
Actividad.belongsTo(Rubrica, {
    foreignKey: 'id_rubrica',
    as: 'rubrica'
});
Rubrica.hasMany(Actividad, {
    foreignKey: 'id_rubrica',
    as: 'actividades'
});

// Rubrica -> RubricaCriterio (una rúbrica tiene muchos criterios)
Rubrica.hasMany(RubricaCriterio, {
    foreignKey: 'id_rubrica',
    as: 'criterios'
});
RubricaCriterio.belongsTo(Rubrica, {
    foreignKey: 'id_rubrica',
    as: 'rubrica'
});

// Criterio -> RubricaCriterio (un criterio puede estar en muchas rúbricas)
Criterio.hasMany(RubricaCriterio, {
    foreignKey: 'id_criterio',
    as: 'rubricaCriterios'
});
RubricaCriterio.belongsTo(Criterio, {
    foreignKey: 'id_criterio',
    as: 'criterio'
});

// RubricaCriterio -> NivelCriterio (un criterio tiene varios niveles)
RubricaCriterio.hasMany(NivelCriterio, {
    foreignKey: 'id_rubrica_criterio',
    as: 'niveles'
});
NivelCriterio.belongsTo(RubricaCriterio, {
    foreignKey: 'id_rubrica_criterio',
    as: 'rubricaCriterio'
});

// Entrega -> Evaluacion (una entrega puede tener varias evaluaciones)
Entrega.hasMany(Evaluacion, {
    foreignKey: 'id_entrega',
    as: 'evaluaciones'
});
Evaluacion.belongsTo(Entrega, {
    foreignKey: 'id_entrega',
    as: 'entrega'
});

// Evaluacion -> DetalleEvaluacion (una evaluación tiene detalles por criterio)
Evaluacion.hasMany(DetalleEvaluacion, {
    foreignKey: 'id_evaluacion',
    as: 'detalles'
});
DetalleEvaluacion.belongsTo(Evaluacion, {
    foreignKey: 'id_evaluacion',
    as: 'evaluacion'
});

// RubricaCriterio -> DetalleEvaluacion (para saber qué criterio se evaluó)
RubricaCriterio.hasMany(DetalleEvaluacion, {
    foreignKey: 'id_rubrica_criterio',
    as: 'detallesEvaluacion'
});
DetalleEvaluacion.belongsTo(RubricaCriterio, {
    foreignKey: 'id_rubrica_criterio',
    as: 'rubricaCriterio'
});

// NivelCriterio -> DetalleEvaluacion (para saber qué nivel se asignó)
NivelCriterio.hasMany(DetalleEvaluacion, {
    foreignKey: 'id_nivel_criterio',
    as: 'detallesEvaluacion'
});
DetalleEvaluacion.belongsTo(NivelCriterio, {
    foreignKey: 'id_nivel_criterio',
    as: 'nivelCriterio'
});

// ========== RELACIONES DE GRUPOS ==========

// Actividad -> Grupo (una actividad puede tener muchos grupos)
Actividad.hasMany(Grupo, {
    foreignKey: 'id_actividad',
    as: 'grupos'
});
Grupo.belongsTo(Actividad, {
    foreignKey: 'id_actividad',
    as: 'actividad'
});

// Grupo -> MiembroGrupo (un grupo tiene muchos miembros)
Grupo.hasMany(MiembroGrupo, {
    foreignKey: 'id_grupo',
    as: 'miembros'
});
MiembroGrupo.belongsTo(Grupo, {
    foreignKey: 'id_grupo',
    as: 'grupo'
});

// Entrega -> Grupo (una entrega puede ser de un grupo)
Entrega.belongsTo(Grupo, {
    foreignKey: 'id_grupo',
    as: 'grupo'
});
Grupo.hasMany(Entrega, {
    foreignKey: 'id_grupo',
    as: 'entregas'
});

// ========== RELACIONES DE COMENTARIOS ==========

// Entrega -> Comentario (una entrega puede tener muchos comentarios)
Entrega.hasMany(Comentario, {
    foreignKey: 'id_entrega',
    as: 'comentarios'
});
Comentario.belongsTo(Entrega, {
    foreignKey: 'id_entrega',
    as: 'entrega'
});

// ========== RELACIONES DE MATERIALES ==========

// Actividad -> MaterialActividad (una actividad puede tener muchos materiales/documentos)
Actividad.hasMany(MaterialActividad, {
    foreignKey: 'id_actividad',
    as: 'materiales'
});
MaterialActividad.belongsTo(Actividad, {
    foreignKey: 'id_actividad',
    as: 'actividad'
});

module.exports = {
    // Modelos existentes
    Curso,
    Unidad,
    Actividad,
    Entrega,
    ArchivoEntrega,
    // Nuevos modelos de evaluación
    Rubrica,
    Criterio,
    RubricaCriterio,
    NivelCriterio,
    Evaluacion,
    DetalleEvaluacion,
    // Modelos de grupos
    Grupo,
    MiembroGrupo,
    // Modelo de comentarios
    Comentario,
    // Modelo de materiales
    MaterialActividad
};