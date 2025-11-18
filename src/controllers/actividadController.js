// src/controllers/actividadController.js
const Actividad = require('../models/Actividad');
const Unidad = require('../models/Unidad');
const Curso = require('../models/Curso');
const { verificarInscripcionEnUnidad } = require('../utils/inscripcionHelper');

const actividadController = {
  // Obtener todas las actividades
  getAllActividades: async (req, res) => {
    try {
      const actividades = await Actividad.findAll({
        include: [{
          model: Unidad,
          as: 'unidad',
          attributes: ['id_unidad', 'titulo_unidad', 'numero_unidad'],
          include: [{
            model: Curso,
            as: 'curso',
            attributes: ['id_curso', 'nombre_curso']
          }]
        }],
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: actividades,
        message: 'Actividades obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener actividades por unidad
  getActividadesByUnidad: async (req, res) => {
    try {
      const { unidadId } = req.params;

      const actividades = await Actividad.findAll({
        where: { id_unidad: unidadId },
        include: [{
          model: Unidad,
          as: 'unidad',
          attributes: ['titulo_unidad', 'numero_unidad']
        }],
        order: [['created_at', 'ASC']]
      });

      res.status(200).json({
        success: true,
        data: actividades,
        message: 'Actividades de la unidad obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener actividades por unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener actividad por ID
  getActividadById: async (req, res) => {
    try {
      const { id } = req.params;

      const actividad = await Actividad.findByPk(id, {
        include: [{
          model: Unidad,
          as: 'unidad',
          attributes: ['id_unidad', 'titulo_unidad', 'numero_unidad'],
          include: [{
            model: Curso,
            as: 'curso',
            attributes: ['id_curso', 'nombre_curso']
          }]
        }]
      });

      if (!actividad) {
        return res.status(404).json({
          success: false,
          message: 'Actividad no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: actividad,
        message: 'Actividad obtenida exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener actividad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Crear nueva actividad
  createActividad: async (req, res) => {
    try {
      const {
        nombre_actividad,
        descripcion,
        fecha_limite,
        tipo_actividad,
        id_unidad,
        id_usuario,
        id_rubrica
      } = req.body;
      const userId = req.user.id;

      // Validar campos requeridos
      if (!nombre_actividad || !tipo_actividad || !id_unidad || !id_usuario) {
        return res.status(400).json({
          success: false,
          message: 'Los campos nombre_actividad, tipo_actividad, id_unidad e id_usuario son obligatorios'
        });
      }

      // Validar tipo_actividad
      if (!['individual', 'grupal'].includes(tipo_actividad)) {
        return res.status(400).json({
          success: false,
          message: 'tipo_actividad debe ser "individual" o "grupal"'
        });
      }

      // Verificar que el docente esté inscrito en el curso de la unidad
      const estaInscrito = await verificarInscripcionEnUnidad(userId, id_unidad);

      if (!estaInscrito) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para crear actividades en este curso. Solo puedes gestionar cursos donde estás inscrito.'
        });
      }

      // Verificar que la unidad existe
      const unidadExiste = await Unidad.findByPk(id_unidad);
      if (!unidadExiste) {
        return res.status(404).json({
          success: false,
          message: 'La unidad especificada no existe'
        });
      }

      const nuevaActividad = await Actividad.create({
        nombre_actividad,
        descripcion,
        fecha_limite,
        tipo_actividad,
        id_unidad,
        id_usuario,
        id_rubrica,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Obtener la actividad creada con la unidad incluida
      const actividadCompleta = await Actividad.findByPk(nuevaActividad.id_actividad, {
        include: [{
          model: Unidad,
          as: 'unidad',
          attributes: ['titulo_unidad']
        }]
      });

      res.status(201).json({
        success: true,
        data: actividadCompleta,
        message: 'Actividad creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear actividad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar actividad
  updateActividad: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre_actividad,
        descripcion,
        fecha_limite,
        tipo_actividad,
        id_rubrica
      } = req.body;

      const actividad = await Actividad.findByPk(id);

      if (!actividad) {
        return res.status(404).json({
          success: false,
          message: 'Actividad no encontrada'
        });
      }

      // Validar tipo_actividad si se está actualizando
      if (tipo_actividad && !['individual', 'grupal'].includes(tipo_actividad)) {
        return res.status(400).json({
          success: false,
          message: 'tipo_actividad debe ser "individual" o "grupal"'
        });
      }

      await actividad.update({
        nombre_actividad: nombre_actividad || actividad.nombre_actividad,
        descripcion: descripcion !== undefined ? descripcion : actividad.descripcion,
        fecha_limite: fecha_limite !== undefined ? fecha_limite : actividad.fecha_limite,
        tipo_actividad: tipo_actividad || actividad.tipo_actividad,
        id_rubrica: id_rubrica !== undefined ? id_rubrica : actividad.id_rubrica,
        updated_at: new Date()
      });

      const actividadActualizada = await Actividad.findByPk(id, {
        include: [{
          model: Unidad,
          as: 'unidad',
          attributes: ['titulo_unidad']
        }]
      });

      res.status(200).json({
        success: true,
        data: actividadActualizada,
        message: 'Actividad actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar actividad
  deleteActividad: async (req, res) => {
    try {
      const { id } = req.params;

      const actividad = await Actividad.findByPk(id);

      if (!actividad) {
        return res.status(404).json({
          success: false,
          message: 'Actividad no encontrada'
        });
      }

      await actividad.destroy();

      res.status(200).json({
        success: true,
        message: 'Actividad eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = actividadController;