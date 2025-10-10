// src/controllers/entregaController.js
const Entrega = require('../models/Entrega');
const ArchivoEntrega = require('../models/ArchivoEntrega');
const Actividad = require('../models/Actividad');
const Unidad = require('../models/Unidad');
const Curso = require('../models/Curso');

const entregaController = {
  // Obtener todas las entregas (vista docente)
  getAllEntregas: async (req, res) => {
    try {
      const entregas = await Entrega.findAll({
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['id_actividad', 'nombre_actividad', 'tipo_actividad', 'fecha_limite'],
            include: [{
              model: Unidad,
              as: 'unidad',
              attributes: ['titulo_unidad', 'numero_unidad'],
              include: [{
                model: Curso,
                as: 'curso',
                attributes: ['nombre_curso']
              }]
            }]
          },
          {
            model: ArchivoEntrega,
            as: 'archivos',
            attributes: ['id_archivo_entrega', 'nombre_archivo', 'tipo_archivo', 'url_archivo']
          }
        ],
        order: [['fecha_entrega', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: entregas,
        message: 'Entregas obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener entregas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener entregas por actividad (para calificar)
  getEntregasByActividad: async (req, res) => {
    try {
      const { actividadId } = req.params;
      
      const entregas = await Entrega.findAll({
        where: { id_actividad: actividadId },
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['nombre_actividad', 'tipo_actividad', 'fecha_limite']
          },
          {
            model: ArchivoEntrega,
            as: 'archivos',
            attributes: ['nombre_archivo', 'tipo_archivo', 'url_archivo', 'created_at']
          }
        ],
        order: [['fecha_entrega', 'ASC']]
      });

      // Agregar estadísticas útiles para el docente
      const stats = {
        total_entregas: entregas.length,
        entregas_a_tiempo: entregas.filter(e => {
          const fechaLimite = new Date(e.actividad.fecha_limite);
          const fechaEntrega = new Date(e.fecha_entrega);
          return fechaEntrega <= fechaLimite;
        }).length,
        entregas_tardias: entregas.filter(e => {
          const fechaLimite = new Date(e.actividad.fecha_limite);
          const fechaEntrega = new Date(e.fecha_entrega);
          return fechaEntrega > fechaLimite;
        }).length
      };

      res.status(200).json({
        success: true,
        data: {
          entregas,
          estadisticas: stats
        },
        message: 'Entregas de la actividad obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener entregas por actividad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener entregas por curso (para gestión del docente)
  getEntregasByCurso: async (req, res) => {
    try {
      const { cursoId } = req.params;

      const entregas = await Entrega.findAll({
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['nombre_actividad', 'tipo_actividad', 'fecha_limite'],
            include: [{
              model: Unidad,
              as: 'unidad',
              where: { id_curso: cursoId },
              attributes: ['titulo_unidad']
            }]
          },
          {
            model: ArchivoEntrega,
            as: 'archivos',
            attributes: ['nombre_archivo', 'tipo_archivo']
          }
        ],
        order: [['fecha_entrega', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: entregas,
        message: 'Entregas del curso obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener entregas por curso:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener entregas por usuario/estudiante (para seguimiento)
  getEntregasByUsuario: async (req, res) => {
    try {
      const { usuarioId } = req.params;

      const entregas = await Entrega.findAll({
        where: { id_usuario: usuarioId },
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['nombre_actividad', 'fecha_limite', 'tipo_actividad'],
            include: [{
              model: Unidad,
              as: 'unidad',
              attributes: ['titulo_unidad']
            }]
          },
          {
            model: ArchivoEntrega,
            as: 'archivos',
            attributes: ['nombre_archivo', 'tipo_archivo']
          }
        ],
        order: [['fecha_entrega', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: entregas,
        message: 'Entregas del estudiante obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener entregas por usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener entrega por ID (para revisión detallada)
  getEntregaById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const entrega = await Entrega.findByPk(id, {
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['nombre_actividad', 'descripcion', 'fecha_limite', 'tipo_actividad']
          },
          {
            model: ArchivoEntrega,
            as: 'archivos'
          }
        ]
      });

      if (!entrega) {
        return res.status(404).json({
          success: false,
          message: 'Entrega no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: entrega,
        message: 'Entrega obtenida exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener entrega:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener estadísticas generales de entregas (dashboard docente)
  getEstadisticasEntregas: async (req, res) => {
    try {
      const { cursoId } = req.query;

      let whereClause = {};
      let includeClause = [
        {
          model: Actividad,
          as: 'actividad',
          attributes: ['fecha_limite', 'tipo_actividad']
        }
      ];

      // Si se especifica un curso, filtrar por ese curso
      if (cursoId) {
        includeClause[0].include = [{
          model: Unidad,
          as: 'unidad',
          where: { id_curso: cursoId }
        }];
      }

      const entregas = await Entrega.findAll({
        include: includeClause,
        order: [['fecha_entrega', 'DESC']]
      });

      const ahora = new Date();
      const stats = {
        total_entregas: entregas.length,
        entregas_individuales: entregas.filter(e => e.actividad.tipo_actividad === 'individual').length,
        entregas_grupales: entregas.filter(e => e.actividad.tipo_actividad === 'grupal').length,
        entregas_a_tiempo: entregas.filter(e => {
          const fechaLimite = new Date(e.actividad.fecha_limite);
          const fechaEntrega = new Date(e.fecha_entrega);
          return fechaEntrega <= fechaLimite;
        }).length,
        entregas_tardias: entregas.filter(e => {
          const fechaLimite = new Date(e.actividad.fecha_limite);
          const fechaEntrega = new Date(e.fecha_entrega);
          return fechaEntrega > fechaLimite;
        }).length,
        entregas_esta_semana: entregas.filter(e => {
          const fechaEntrega = new Date(e.fecha_entrega);
          const inicioSemana = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
          return fechaEntrega >= inicioSemana;
        }).length
      };

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Estadísticas de entregas obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar entrega problemática (gestión del docente)
  deleteEntrega: async (req, res) => {
    try {
      const { id } = req.params;

      const entrega = await Entrega.findByPk(id);
      
      if (!entrega) {
        return res.status(404).json({
          success: false,
          message: 'Entrega no encontrada'
        });
      }

      // Eliminar archivos asociados primero
      await ArchivoEntrega.destroy({
        where: { id_entrega: id }
      });

      // Eliminar la entrega
      await entrega.destroy();

      res.status(200).json({
        success: true,
        message: 'Entrega eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar entrega:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar archivo específico de una entrega (gestión)
  deleteArchivoEntrega: async (req, res) => {
    try {
      const { entregaId, archivoId } = req.params;

      const archivo = await ArchivoEntrega.findOne({
        where: {
          id_archivo_entrega: archivoId,
          id_entrega: entregaId
        }
      });

      if (!archivo) {
        return res.status(404).json({
          success: false,
          message: 'Archivo no encontrado en esta entrega'
        });
      }

      await archivo.destroy();

      res.status(200).json({
        success: true,
        message: 'Archivo eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = entregaController;