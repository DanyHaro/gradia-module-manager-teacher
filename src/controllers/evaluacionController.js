// src/controllers/evaluacionController.js
const Evaluacion = require('../models/Evaluacion');
const DetalleEvaluacion = require('../models/DetalleEvaluacion');
const Entrega = require('../models/Entrega');
const Actividad = require('../models/Actividad');
const Rubrica = require('../models/Rubrica');
const RubricaCriterio = require('../models/RubricaCriterio');
const NivelCriterio = require('../models/NivelCriterio');
const Criterio = require('../models/Criterio');

const evaluacionController = {
    // Obtener todas las evaluaciones realizadas por un docente
    getAllEvaluaciones: async (req, res) => {
        try {
            const { id_usuario, cursoId } = req.query;
            
            let whereClause = {};
            if (id_usuario) {
                whereClause.id_usuario = id_usuario;
            }

            let includeClause = [
                {
                    model: Entrega,
                    as: 'entrega',
                    include: [{
                        model: Actividad,
                        as: 'actividad',
                        attributes: ['nombre_actividad', 'tipo_actividad']
                    }]
                },
                {
                    model: DetalleEvaluacion,
                    as: 'detalles',
                    include: [
                        {
                            model: RubricaCriterio,
                            as: 'rubricaCriterio',
                            include: [{
                                model: Criterio,
                                as: 'criterio',
                                attributes: ['nombre']
                            }]
                        },
                        {
                            model: NivelCriterio,
                            as: 'nivelCriterio',
                            attributes: ['nombre_nivel', 'puntaje_asignado']
                        }
                    ]
                }
            ];

            const evaluaciones = await Evaluacion.findAll({
                where: whereClause,
                include: includeClause,
                order: [['fecha_evaluacion', 'DESC']]
            });

            res.status(200).json({
                success: true,
                data: evaluaciones,
                message: 'Evaluaciones obtenidas exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener evaluaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Obtener evaluación específica por ID
    getEvaluacionById: async (req, res) => {
        try {
            const { id } = req.params;

            const evaluacion = await Evaluacion.findByPk(id, {
                include: [
                    {
                        model: Entrega,
                        as: 'entrega',
                        include: [{
                            model: Actividad,
                            as: 'actividad',
                            include: [{
                                model: Rubrica,
                                as: 'rubrica',
                                attributes: ['nombre', 'descripcion']
                            }]
                        }]
                    },
                    {
                        model: DetalleEvaluacion,
                        as: 'detalles',
                        include: [
                            {
                                model: RubricaCriterio,
                                as: 'rubricaCriterio',
                                include: [{
                                    model: Criterio,
                                    as: 'criterio'
                                }]
                            },
                            {
                                model: NivelCriterio,
                                as: 'nivelCriterio'
                            }
                        ],
                        order: [['id_detalle', 'ASC']]
                    }
                ]
            });

            if (!evaluacion) {
                return res.status(404).json({
                    success: false,
                    message: 'Evaluación no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: evaluacion,
                message: 'Evaluación obtenida exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener evaluación:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Obtener evaluaciones por entrega
    getEvaluacionesByEntrega: async (req, res) => {
        try {
            const { entregaId } = req.params;

            const evaluaciones = await Evaluacion.findAll({
                where: { id_entrega: entregaId },
                include: [
                    {
                        model: DetalleEvaluacion,
                        as: 'detalles',
                        include: [
                            {
                                model: RubricaCriterio,
                                as: 'rubricaCriterio',
                                include: [{
                                    model: Criterio,
                                    as: 'criterio'
                                }]
                            },
                            {
                                model: NivelCriterio,
                                as: 'nivelCriterio'
                            }
                        ]
                    }
                ],
                order: [['fecha_evaluacion', 'DESC']]
            });

            res.status(200).json({
                success: true,
                data: evaluaciones,
                message: 'Evaluaciones de la entrega obtenidas exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener evaluaciones por entrega:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Crear nueva evaluación completa
    createEvaluacion: async (req, res) => {
        try {
            const {
                id_entrega,
                id_usuario,
                feedback_general,
                detalles // Array de objetos con evaluación por criterio
            } = req.body;

            // Validar campos requeridos
            if (!id_entrega || !id_usuario || !detalles || !Array.isArray(detalles)) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos id_entrega, id_usuario y detalles son obligatorios'
                });
            }

            // Verificar que la entrega existe
            const entrega = await Entrega.findByPk(id_entrega, {
                include: [{
                    model: Actividad,
                    as: 'actividad',
                    include: [{
                        model: Rubrica,
                        as: 'rubrica',
                        include: [{
                            model: RubricaCriterio,
                            as: 'criterios'
                        }]
                    }]
                }]
            });

            if (!entrega) {
                return res.status(404).json({
                    success: false,
                    message: 'Entrega no encontrada'
                });
            }

            if (!entrega.actividad.rubrica) {
                return res.status(400).json({
                    success: false,
                    message: 'La actividad no tiene una rúbrica asignada'
                });
            }

            // Calcular puntaje total
            let puntaje_total = 0;
            for (const detalle of detalles) {
                const nivel = await NivelCriterio.findByPk(detalle.id_nivel_criterio);
                if (nivel) {
                    puntaje_total += nivel.puntaje_asignado;
                }
            }

            // Crear la evaluación
            const nuevaEvaluacion = await Evaluacion.create({
                id_entrega,
                id_usuario,
                puntaje_total,
                feedback_general,
                fecha_evaluacion: new Date()
            });

            // Crear detalles de evaluación
            for (const detalle of detalles) {
                const {
                    id_rubrica_criterio,
                    id_nivel_criterio,
                    feedback_especifico
                } = detalle;

                // Validar que el nivel pertenece al criterio
                const nivel = await NivelCriterio.findOne({
                    where: {
                        id_nivel_criterio,
                        id_rubrica_criterio
                    }
                });

                if (!nivel) {
                    return res.status(400).json({
                        success: false,
                        message: `Nivel de criterio inválido para el criterio ${id_rubrica_criterio}`
                    });
                }

                await DetalleEvaluacion.create({
                    id_evaluacion: nuevaEvaluacion.id_evaluacion,
                    id_rubrica_criterio,
                    id_nivel_criterio,
                    puntaje_obtenido: nivel.puntaje_asignado,
                    feedback_especifico
                });
            }

            // Obtener evaluación completa creada
            const evaluacionCompleta = await Evaluacion.findByPk(nuevaEvaluacion.id_evaluacion, {
                include: [
                    {
                        model: Entrega,
                        as: 'entrega',
                        include: [{
                            model: Actividad,
                            as: 'actividad',
                            attributes: ['nombre_actividad']
                        }]
                    },
                    {
                        model: DetalleEvaluacion,
                        as: 'detalles',
                        include: [
                            {
                                model: RubricaCriterio,
                                as: 'rubricaCriterio',
                                include: [{
                                    model: Criterio,
                                    as: 'criterio'
                                }]
                            },
                            {
                                model: NivelCriterio,
                                as: 'nivelCriterio'
                            }
                        ]
                    }
                ]
            });

            res.status(201).json({
                success: true,
                data: evaluacionCompleta,
                message: 'Evaluación creada exitosamente'
            });
        } catch (error) {
            console.error('Error al crear evaluación:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Actualizar evaluación existente
    updateEvaluacion: async (req, res) => {
        try {
            const { id } = req.params;
            const { feedback_general, detalles } = req.body;

            const evaluacion = await Evaluacion.findByPk(id);
            if (!evaluacion) {
                return res.status(404).json({
                    success: false,
                    message: 'Evaluación no encontrada'
                });
            }

            // Si se proporcionan nuevos detalles, eliminar los anteriores y crear nuevos
            if (detalles && Array.isArray(detalles)) {
                // Eliminar detalles anteriores
                await DetalleEvaluacion.destroy({
                    where: { id_evaluacion: id }
                });

                // Calcular nuevo puntaje total
                let puntaje_total = 0;
                for (const detalle of detalles) {
                    const nivel = await NivelCriterio.findByPk(detalle.id_nivel_criterio);
                    if (nivel) {
                        puntaje_total += nivel.puntaje_asignado;
                    }

                    // Crear nuevo detalle
                    await DetalleEvaluacion.create({
                        id_evaluacion: id,
                        id_rubrica_criterio: detalle.id_rubrica_criterio,
                        id_nivel_criterio: detalle.id_nivel_criterio,
                        puntaje_obtenido: nivel ? nivel.puntaje_asignado : 0,
                        feedback_especifico: detalle.feedback_especifico
                    });
                }

                // Actualizar puntaje total
                await evaluacion.update({
                    puntaje_total,
                    feedback_general: feedback_general !== undefined ? feedback_general : evaluacion.feedback_general
                });
            } else {
                // Solo actualizar feedback general
                await evaluacion.update({
                    feedback_general: feedback_general !== undefined ? feedback_general : evaluacion.feedback_general
                });
            }

            // Obtener evaluación actualizada
            const evaluacionActualizada = await Evaluacion.findByPk(id, {
                include: [
                    {
                        model: DetalleEvaluacion,
                        as: 'detalles',
                        include: [
                            {
                                model: RubricaCriterio,
                                as: 'rubricaCriterio',
                                include: [{
                                    model: Criterio,
                                    as: 'criterio'
                                }]
                            },
                            {
                                model: NivelCriterio,
                                as: 'nivelCriterio'
                            }
                        ]
                    }
                ]
            });

            res.status(200).json({
                success: true,
                data: evaluacionActualizada,
                message: 'Evaluación actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar evaluación:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Eliminar evaluación
    deleteEvaluacion: async (req, res) => {
        try {
            const { id } = req.params;

            const evaluacion = await Evaluacion.findByPk(id);
            if (!evaluacion) {
                return res.status(404).json({
                    success: false,
                    message: 'Evaluación no encontrada'
                });
            }

            // Eliminar detalles primero (por restricción de FK)
            await DetalleEvaluacion.destroy({
                where: { id_evaluacion: id }
            });

            // Eliminar evaluación
            await evaluacion.destroy();

            res.status(200).json({
                success: true,
                message: 'Evaluación eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar evaluación:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Obtener estadísticas de evaluaciones (dashboard docente)
    getEstadisticasEvaluaciones: async (req, res) => {
        try {
            const { id_usuario, cursoId } = req.query;

            let whereClause = {};
            if (id_usuario) {
                whereClause.id_usuario = id_usuario;
            }

            const evaluaciones = await Evaluacion.findAll({
                where: whereClause,
                include: [{
                    model: Entrega,
                    as: 'entrega',
                    include: [{
                        model: Actividad,
                        as: 'actividad',
                        attributes: ['tipo_actividad']
                    }]
                }]
            });

            const ahora = new Date();
            const inicioSemana = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);

            const stats = {
                total_evaluaciones: evaluaciones.length,
                evaluaciones_esta_semana: evaluaciones.filter(e => 
                    new Date(e.fecha_evaluacion) >= inicioSemana
                ).length,
                promedio_puntaje: evaluaciones.length > 0 
                    ? (evaluaciones.reduce((sum, e) => sum + (e.puntaje_total || 0), 0) / evaluaciones.length).toFixed(2)
                    : 0,
                evaluaciones_individuales: evaluaciones.filter(e => 
                    e.entrega.actividad.tipo_actividad === 'individual'
                ).length,
                evaluaciones_grupales: evaluaciones.filter(e => 
                    e.entrega.actividad.tipo_actividad === 'grupal'
                ).length,
                evaluaciones_con_feedback: evaluaciones.filter(e => 
                    e.feedback_general && e.feedback_general.trim() !== ''
                ).length
            };

            res.status(200).json({
                success: true,
                data: stats,
                message: 'Estadísticas de evaluaciones obtenidas exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener estadísticas de evaluaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Obtener retroalimentación detallada desde Elasticsearch
    getRetroalimentacionByEntrega: async (req, res) => {
        try {
            const { entregaId } = req.params;

            // Verificar que la entrega existe
            const entrega = await Entrega.findByPk(entregaId);

            if (!entrega) {
                return res.status(404).json({
                    success: false,
                    message: 'Entrega no encontrada'
                });
            }

            // Importar el cliente de Elasticsearch
            const { es } = require('../config/elasticsearch');

            // Convertir entregaId a número si es necesario
            const entregaIdValue = isNaN(Number(entregaId))
                ? entregaId
                : Number(entregaId);

            // Buscar evaluación en Elasticsearch
            const result = await es.search({
                index: "evaluaciones_rubrica",
                _source_includes: ["evaluacion"],
                query: {
                    term: { entrega_id: entregaIdValue }
                }
            });

            const hit = result.hits.hits[0]?._source;

            if (!hit) {
                return res.status(404).json({
                    success: false,
                    message: 'Evaluación no encontrada en Elasticsearch'
                });
            }

            // Estructurar la respuesta
            const response = {
                notas_por_criterio: hit.evaluacion.notas_por_criterio,

                retroalimentaciones_por_criterio: Object.fromEntries(
                    Object.entries(hit.evaluacion.criterios).map(
                        ([k, v]) => [k, v.justificacion]
                    )
                ),

                retroalimentacion_final: hit.evaluacion.retroalimentacion_global,

                nota_final: hit.evaluacion.nota_final
            };

            res.status(200).json({
                success: true,
                data: response,
                message: 'Retroalimentación obtenida exitosamente'
            });

        } catch (error) {
            console.error('Error al obtener retroalimentación desde Elasticsearch:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = evaluacionController;