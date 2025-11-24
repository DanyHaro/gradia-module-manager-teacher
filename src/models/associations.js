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

// Modelo de Inscripción
const Inscripcion = require('./Inscripcion');

// Modelo de Usuario (READ ONLY - tabla compartida con auth_gradia)
const Usuario = require('./Usuario');
const Persona = require('./Persona');

// ========== RELACIONES DE INSCRIPCIÓN ==========

// Usuario-Curso a través de Inscripcion (relación N:M)
Curso.hasMany(Inscripcion, {
    foreignKey: 'id_curso',
    as: 'inscripciones'
});
Inscripcion.belongsTo(Curso, {
    foreignKey: 'id_curso',
    as: 'curso'
});

Inscripcion.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});
Usuario.hasMany(Inscripcion, {
    foreignKey: 'id_usuario',
    as: 'inscripciones'
});

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

// Entrega -> Usuario (para obtener datos del estudiante)
Entrega.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});
Usuario.hasMany(Entrega, {
    foreignKey: 'id_usuario',
    as: 'entregas'
});

// Usuario -> Persona (para obtener nombre del estudiante)
Usuario.belongsTo(Persona, {
    foreignKey: 'id_persona',
    as: 'persona'
});
Persona.hasOne(Usuario, {
    foreignKey: 'id_persona',
    as: 'usuario'
});

// ========== NUEVAS RELACIONES DE EVALUACIÓN ==========

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

// Actividad -> MaterialActividad
Actividad.hasMany(MaterialActividad, {
    foreignKey: 'id_actividad',
    as: 'materiales'
});
MaterialActividad.belongsTo(Actividad, {
    foreignKey: 'id_actividad',
    as: 'actividad'
});

// ========== RELACIONES DE COMENTARIOS ==========

// Comentario -> Usuario (el autor del comentario)
Comentario.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});
Usuario.hasMany(Comentario, {
    foreignKey: 'id_usuario',
    as: 'comentarios'
});

// Comentario -> Comentario (relación recursiva para respuestas)
Comentario.hasMany(Comentario, {
    foreignKey: 'parent_id',
    as: 'respuestas'
});
Comentario.belongsTo(Comentario, {
    foreignKey: 'parent_id',
    as: 'comentarioPadre'
});

// Comentario -> Actividad (comentarios de una actividad)
Actividad.hasMany(Comentario, {
    foreignKey: 'id_actividad',
    as: 'comentarios'
});
Comentario.belongsTo(Actividad, {
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
    MaterialActividad,
    // Modelo de inscripción
    Inscripcion,
    // Modelo de usuario (READ ONLY)
    Usuario,
    Persona
};