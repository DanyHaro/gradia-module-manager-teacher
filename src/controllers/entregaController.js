// src/controllers/entregaController.js
const Entrega = require('../models/Entrega');
const ArchivoEntrega = require('../models/ArchivoEntrega');
const Actividad = require('../models/Actividad');
const Unidad = require('../models/Unidad');
const Curso = require('../models/Curso');
const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');
const Inscripcion = require('../models/Inscripcion');

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
      console.log(`[DEBUG] Solicitando entregas para actividad: ${actividadId}`);

      // 1. Obtener la actividad y su curso
      const actividad = await Actividad.findByPk(actividadId, {
        include: [{
          model: Unidad,
          as: 'unidad',
          include: [{
            model: Curso,
            as: 'curso'
          }]
        }]
      });

      if (!actividad) {
        return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
      }

      const cursoId = actividad.unidad?.curso?.id_curso;
      if (!cursoId) {
        return res.status(500).json({ success: false, message: 'No se pudo determinar el curso' });
      }

      console.log(`[DEBUG] Curso ID: ${cursoId}`);

      // 2. Obtener estudiantes inscritos en el curso
      const inscripciones = await Inscripcion.findAll({
        where: { id_curso: cursoId, deleted_at: null },
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'correo_institucional'],
          include: [{
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'apellido']
          }]
        }]
      });

      console.log(`[DEBUG] Inscritos encontrados: ${inscripciones.length}`);

      // 3. Obtener entregas existentes
      const entregas = await Entrega.findAll({
        where: { id_actividad: actividadId },
        include: [{
          model: ArchivoEntrega,
          as: 'archivos',
          attributes: ['id_archivo_entrega', 'nombre_archivo', 'tipo_archivo', 'url_archivo']
        }]
      });

      console.log(`[DEBUG] Entregas encontradas: ${entregas.length}`);

      // 4. Combinar: crear un objeto por cada estudiante inscrito
      const resultado = inscripciones.map(inscripcion => {
        const usuario = inscripcion.usuario;
        const entrega = entregas.find(e => e.id_usuario === usuario.id_usuario);

        if (entrega) {
          // Estudiante SÍ entregó
          return {
            id_entrega: entrega.id_entrega,
            id_usuario: usuario.id_usuario,
            fecha_entrega: entrega.fecha_entrega,
            calificacion: entrega.calificacion,
            retroalimentacion: entrega.retroalimentacion,
            usuario: {
              id_usuario: usuario.id_usuario,
              correo_institucional: usuario.correo_institucional,
              persona: usuario.persona
            },
            archivos: entrega.archivos || []
          };
        } else {
          // Estudiante NO entregó
          return {
            id_entrega: null,
            id_usuario: usuario.id_usuario,
            fecha_entrega: null,
            calificacion: null,
            retroalimentacion: null,
            usuario: {
              id_usuario: usuario.id_usuario,
              correo_institucional: usuario.correo_institucional,
              persona: usuario.persona
            },
            archivos: []
          };
        }
      });

      console.log(`[DEBUG] Resultado final: ${resultado.length} estudiantes`);

      res.status(200).json({
        success: true,
        data: resultado,
        message: 'Lista de estudiantes con entregas obtenida exitosamente'
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
  },

  // Calificar una entrega (NUEVO)
  calificarEntrega: async (req, res) => {
    try {
      const { id } = req.params;
      const { calificacion, retroalimentacion } = req.body;

      console.log(`[DEBUG] Calificando entrega ${id}:`, { calificacion, retroalimentacion });

      // Validar que la entrega existe
      const entrega = await Entrega.findByPk(id);
      if (!entrega) {
        return res.status(404).json({
          success: false,
          message: 'Entrega no encontrada'
        });
      }

      // Validar que la calificación sea un número válido
      if (calificacion !== null && calificacion !== undefined) {
        const nota = parseFloat(calificacion);
        if (isNaN(nota) || nota < 0 || nota > 20) {
          return res.status(400).json({
            success: false,
            message: 'La calificación debe ser un número entre 0 y 20'
          });
        }
      }

      // Actualizar la entrega con la calificación y retroalimentación
      await entrega.update({
        calificacion: calificacion !== null && calificacion !== undefined ? parseFloat(calificacion) : null,
        retroalimentacion: retroalimentacion || null,
        updated_at: new Date()
      });

      console.log(`✅ Entrega ${id} calificada exitosamente`);

      // Devolver la entrega actualizada
      const entregaActualizada = await Entrega.findByPk(id, {
        include: [{
          model: ArchivoEntrega,
          as: 'archivos',
          attributes: ['id_archivo_entrega', 'nombre_archivo', 'tipo_archivo', 'url_archivo']
        }]
      });

      res.status(200).json({
        success: true,
        data: entregaActualizada,
        message: 'Entrega calificada exitosamente'
      });

    } catch (error) {
      console.error('Error al calificar entrega:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = entregaController;
