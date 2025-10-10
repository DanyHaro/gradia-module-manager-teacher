// src/controllers/criterioController.js
const Criterio = require('../models/Criterio');
const RubricaCriterio = require('../models/RubricaCriterio');

const criterioController = {
    // Obtener todos los criterios disponibles
    getAllCriterios: async (req, res) => {
        try {
            const criterios = await Criterio.findAll({
                order: [['nombre', 'ASC']]
            });

            res.status(200).json({
                success: true,
                data: criterios,
                message: 'Criterios obtenidos exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener criterios:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Obtener criterio por ID
    getCriterioById: async (req, res) => {
        try {
            const { id } = req.params;

            const criterio = await Criterio.findByPk(id);
            
            if (!criterio) {
                return res.status(404).json({
                    success: false,
                    message: 'Criterio no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: criterio,
                message: 'Criterio obtenido exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener criterio:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Crear nuevo criterio
    createCriterio: async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;

            // Validar campos requeridos
            if (!nombre) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo nombre es obligatorio'
                });
            }

            // Verificar que no exista un criterio con el mismo nombre
            const criterioExistente = await Criterio.findOne({
                where: { nombre }
            });

            if (criterioExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un criterio con ese nombre'
                });
            }

            const nuevoCriterio = await Criterio.create({
                nombre,
                descripcion
            });

            res.status(201).json({
                success: true,
                data: nuevoCriterio,
                message: 'Criterio creado exitosamente'
            });
        } catch (error) {
            console.error('Error al crear criterio:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Actualizar criterio
    updateCriterio: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;

            const criterio = await Criterio.findByPk(id);
            if (!criterio) {
                return res.status(404).json({
                    success: false,
                    message: 'Criterio no encontrado'
                });
            }

            // Si se está actualizando el nombre, verificar que no exista duplicado
            if (nombre && nombre !== criterio.nombre) {
                const criterioExistente = await Criterio.findOne({
                    where: { nombre }
                });

                if (criterioExistente) {
                    return res.status(400).json({
                        success: false,
                        message: 'Ya existe un criterio con ese nombre'
                    });
                }
            }

            await criterio.update({
                nombre: nombre || criterio.nombre,
                descripcion: descripcion !== undefined ? descripcion : criterio.descripcion
            });

            res.status(200).json({
                success: true,
                data: criterio,
                message: 'Criterio actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar criterio:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Eliminar criterio (solo si no está siendo usado)
    deleteCriterio: async (req, res) => {
        try {
            const { id } = req.params;

            const criterio = await Criterio.findByPk(id);
            if (!criterio) {
                return res.status(404).json({
                    success: false,
                    message: 'Criterio no encontrado'
                });
            }

            // Verificar si está siendo usado en rúbricas
            const rubricasCriterioCount = await RubricaCriterio.count({
                where: { id_criterio: id }
            });

            if (rubricasCriterioCount > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede eliminar el criterio porque está siendo utilizado en rúbricas'
                });
            }

            await criterio.destroy();

            res.status(200).json({
                success: true,
                message: 'Criterio eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar criterio:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Buscar criterios por nombre (útil para autocompletado)
    searchCriterios: async (req, res) => {
        try {
            const { q } = req.query;

            if (!q || q.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetro de búsqueda requerido'
                });
            }

            const criterios = await Criterio.findAll({
                where: {
                    nombre: {
                        [require('sequelize').Op.iLike]: `%${q.trim()}%`
                    }
                },
                order: [['nombre', 'ASC']],
                limit: 10
            });

            res.status(200).json({
                success: true,
                data: criterios,
                message: 'Criterios encontrados exitosamente'
            });
        } catch (error) {
            console.error('Error al buscar criterios:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = criterioController;