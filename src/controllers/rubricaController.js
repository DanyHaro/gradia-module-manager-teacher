// src/controllers/rubricaController.js
const Rubrica = require('../models/Rubrica');
const RubricaCriterio = require('../models/RubricaCriterio');
const Criterio = require('../models/Criterio');
const NivelCriterio = require('../models/NivelCriterio');

const rubricaController = {
    // Obtener todas las rúbricas del docente
    getAllRubricas: async (req, res) => {
        try {
            const { id_usuario } = req.query;
            
            let whereClause = {};
            if (id_usuario) {
                whereClause.id_usuario = id_usuario;
            }

            const rubricas = await Rubrica.findAll({
                where: whereClause,
                include: [{
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: Criterio,
                            as: 'criterio',
                            attributes: ['nombre', 'descripcion']
                        },
                        {
                            model: NivelCriterio,
                            as: 'niveles',
                            attributes: ['nombre_nivel', 'descripcion', 'puntaje_asignado', 'orden']
                        }
                    ]
                }],
                order: [['created_at', 'DESC']]
            });

            res.status(200).json({
                success: true,
                data: rubricas,
                message: 'Rúbricas obtenidas exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener rúbricas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Obtener rúbrica por ID con todos sus detalles
    getRubricaById: async (req, res) => {
        try {
            const { id } = req.params;

            const rubrica = await Rubrica.findByPk(id, {
                include: [{
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: Criterio,
                            as: 'criterio'
                        },
                        {
                            model: NivelCriterio,
                            as: 'niveles',
                            order: [['orden', 'ASC']]
                        }
                    ],
                    order: [['orden', 'ASC']]
                }]
            });

            if (!rubrica) {
                return res.status(404).json({
                    success: false,
                    message: 'Rúbrica no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: rubrica,
                message: 'Rúbrica obtenida exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener rúbrica:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Crear nueva rúbrica completa con criterios y niveles
    createRubrica: async (req, res) => {
        try {
            const { nombre, descripcion, id_usuario, criterios } = req.body;

            // Validar campos requeridos
            if (!nombre || !id_usuario) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos nombre e id_usuario son obligatorios'
                });
            }

            // Crear la rúbrica
            const nuevaRubrica = await Rubrica.create({
                nombre,
                descripcion,
                id_usuario,
                created_at: new Date(),
                updated_at: new Date()
            });

            // Si se proporcionaron criterios, crearlos
            if (criterios && Array.isArray(criterios)) {
                for (let i = 0; i < criterios.length; i++) {
                    const criterioData = criterios[i];
                    
                    // Verificar si el criterio existe o crearlo
                    let criterio = await Criterio.findByPk(criterioData.id_criterio);
                    if (!criterio && criterioData.nombre_criterio) {
                        criterio = await Criterio.create({
                            nombre: criterioData.nombre_criterio,
                            descripcion: criterioData.descripcion_criterio
                        });
                    }

                    if (criterio) {
                        // Crear RubricaCriterio
                        const rubricaCriterio = await RubricaCriterio.create({
                            id_rubrica: nuevaRubrica.id_rubrica,
                            id_criterio: criterio.id_criterio,
                            peso: criterioData.peso || 1.0,
                            puntaje_maximo: criterioData.puntaje_maximo,
                            orden: i + 1
                        });

                        // Crear niveles si se proporcionaron
                        if (criterioData.niveles && Array.isArray(criterioData.niveles)) {
                            for (let j = 0; j < criterioData.niveles.length; j++) {
                                const nivelData = criterioData.niveles[j];
                                await NivelCriterio.create({
                                    id_rubrica_criterio: rubricaCriterio.id_rubrica_criterio,
                                    nombre_nivel: nivelData.nombre_nivel,
                                    descripcion: nivelData.descripcion,
                                    puntaje_asignado: nivelData.puntaje_asignado,
                                    orden: j + 1
                                });
                            }
                        }
                    }
                }
            }

            // Obtener la rúbrica completa creada
            const rubricaCompleta = await Rubrica.findByPk(nuevaRubrica.id_rubrica, {
                include: [{
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: Criterio,
                            as: 'criterio'
                        },
                        {
                            model: NivelCriterio,
                            as: 'niveles',
                            order: [['orden', 'ASC']]
                        }
                    ],
                    order: [['orden', 'ASC']]
                }]
            });

            res.status(201).json({
                success: true,
                data: rubricaCompleta,
                message: 'Rúbrica creada exitosamente'
            });
        } catch (error) {
            console.error('Error al crear rúbrica:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Actualizar rúbrica
    updateRubrica: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;

            const rubrica = await Rubrica.findByPk(id);
            if (!rubrica) {
                return res.status(404).json({
                    success: false,
                    message: 'Rúbrica no encontrada'
                });
            }

            await rubrica.update({
                nombre: nombre || rubrica.nombre,
                descripcion: descripcion !== undefined ? descripcion : rubrica.descripcion,
                updated_at: new Date()
            });

            const rubricaActualizada = await Rubrica.findByPk(id, {
                include: [{
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: Criterio,
                            as: 'criterio'
                        },
                        {
                            model: NivelCriterio,
                            as: 'niveles'
                        }
                    ]
                }]
            });

            res.status(200).json({
                success: true,
                data: rubricaActualizada,
                message: 'Rúbrica actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar rúbrica:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Eliminar rúbrica (solo si no está siendo usada)
    deleteRubrica: async (req, res) => {
        try {
            const { id } = req.params;

            const rubrica = await Rubrica.findByPk(id);
            if (!rubrica) {
                return res.status(404).json({
                    success: false,
                    message: 'Rúbrica no encontrada'
                });
            }

            // Verificar si está siendo usada en actividades (necesitarías importar el modelo Actividad)
            // const actividadesCount = await Actividad.count({ where: { id_rubrica: id } });
            // if (actividadesCount > 0) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'No se puede eliminar la rúbrica porque está siendo utilizada en actividades'
            //     });
            // }

            // Eliminar en cascada: niveles -> criterios -> rúbrica
            const criterios = await RubricaCriterio.findAll({ where: { id_rubrica: id } });
            
            for (const criterio of criterios) {
                await NivelCriterio.destroy({ where: { id_rubrica_criterio: criterio.id_rubrica_criterio } });
            }
            
            await RubricaCriterio.destroy({ where: { id_rubrica: id } });
            await rubrica.destroy();

            res.status(200).json({
                success: true,
                message: 'Rúbrica eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar rúbrica:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Duplicar rúbrica (útil para docentes)
    duplicateRubrica: async (req, res) => {
        try {
            const { id } = req.params;
            const { nuevo_nombre, id_usuario } = req.body;

            const rubricaOriginal = await Rubrica.findByPk(id, {
                include: [{
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: Criterio,
                            as: 'criterio'
                        },
                        {
                            model: NivelCriterio,
                            as: 'niveles'
                        }
                    ]
                }]
            });

            if (!rubricaOriginal) {
                return res.status(404).json({
                    success: false,
                    message: 'Rúbrica original no encontrada'
                });
            }

            // Crear nueva rúbrica
            const nuevaRubrica = await Rubrica.create({
                nombre: nuevo_nombre || `${rubricaOriginal.nombre} (Copia)`,
                descripcion: rubricaOriginal.descripcion,
                id_usuario: id_usuario || rubricaOriginal.id_usuario,
                created_at: new Date(),
                updated_at: new Date()
            });

            // Duplicar criterios y niveles
            for (const criterioOriginal of rubricaOriginal.criterios) {
                const nuevoCriterio = await RubricaCriterio.create({
                    id_rubrica: nuevaRubrica.id_rubrica,
                    id_criterio: criterioOriginal.id_criterio,
                    peso: criterioOriginal.peso,
                    puntaje_maximo: criterioOriginal.puntaje_maximo,
                    orden: criterioOriginal.orden
                });

                // Duplicar niveles
                for (const nivelOriginal of criterioOriginal.niveles) {
                    await NivelCriterio.create({
                        id_rubrica_criterio: nuevoCriterio.id_rubrica_criterio,
                        nombre_nivel: nivelOriginal.nombre_nivel,
                        descripcion: nivelOriginal.descripcion,
                        puntaje_asignado: nivelOriginal.puntaje_asignado,
                        orden: nivelOriginal.orden
                    });
                }
            }

            // Obtener la rúbrica duplicada completa
            const rubricaDuplicada = await Rubrica.findByPk(nuevaRubrica.id_rubrica, {
                include: [{
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: Criterio,
                            as: 'criterio'
                        },
                        {
                            model: NivelCriterio,
                            as: 'niveles',
                            order: [['orden', 'ASC']]
                        }
                    ],
                    order: [['orden', 'ASC']]
                }]
            });

            res.status(201).json({
                success: true,
                data: rubricaDuplicada,
                message: 'Rúbrica duplicada exitosamente'
            });
        } catch (error) {
            console.error('Error al duplicar rúbrica:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = rubricaController;