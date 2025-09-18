// src/controllers/actividadController.js
const Actividad = require('../models/Actividad');
const Sesion = require('../models/Sesion');
const Unidad = require('../models/Unidad');
const Curso = require('../models/Curso');

const actividadController = {
  // Obtener todas las actividades
  getAllActividades: async (req, res) => {
    try {
      const actividades = await Actividad.findAll({
        include: [{
          model: Sesion,
          as: 'sesion',
          attributes: ['id_sesion', 'titulo_sesion', 'numero_sesion'],
          include: [{
            model: Unidad,
            as: 'unidad',
            attributes: ['id_unidad', 'titulo_unidad'],
            include: [{
              model: Curso,
              as: 'curso',
              attributes: ['id_curso', 'nombre_curso']
            }]
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

  // Obtener actividades por sesión
  getActividadesBySesion: async (req, res) => {
    try {
      const { sesionId } = req.params;
      
      const actividades = await Actividad.findAll({
        where: { id_sesion: sesionId },
        include: [{
          model: Sesion,
          as: 'sesion',
          attributes: ['titulo_sesion']
        }],
        order: [['created_at', 'ASC']]
      });

      res.status(200).json({
        success: true,
        data: actividades,
        message: 'Actividades de la sesión obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener actividades por sesión:', error);
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
          model: Sesion,
          as: 'sesion',
          attributes: ['id_sesion', 'titulo_sesion', 'numero_sesion'],
          include: [{
            model: Unidad,
            as: 'unidad',
            attributes: ['id_unidad', 'titulo_unidad'],
            include: [{
              model: Curso,
              as: 'curso',
              attributes: ['id_curso', 'nombre_curso']
            }]
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
        id_sesion, 
        id_usuario,
        id_rubrica 
      } = req.body;

      // Validar campos requeridos
      if (!nombre_actividad || !tipo_actividad || !id_sesion || !id_usuario) {
        return res.status(400).json({
          success: false,
          message: 'Los campos nombre_actividad, tipo_actividad, id_sesion e id_usuario son obligatorios'
        });
      }

      // Validar tipo_actividad
      if (!['individual', 'grupal'].includes(tipo_actividad)) {
        return res.status(400).json({
          success: false,
          message: 'tipo_actividad debe ser "individual" o "grupal"'
        });
      }

      // Verificar que la sesión existe
      const sesionExiste = await Sesion.findByPk(id_sesion);
      if (!sesionExiste) {
        return res.status(404).json({
          success: false,
          message: 'La sesión especificada no existe'
        });
      }

      const nuevaActividad = await Actividad.create({
        nombre_actividad,
        descripcion,
        fecha_limite,
        tipo_actividad,
        id_sesion,
        id_usuario,
        id_rubrica,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Obtener la actividad creada con la sesión incluida
      const actividadCompleta = await Actividad.findByPk(nuevaActividad.id_actividad, {
        include: [{
          model: Sesion,
          as: 'sesion',
          attributes: ['titulo_sesion']
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
          model: Sesion,
          as: 'sesion',
          attributes: ['titulo_sesion']
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