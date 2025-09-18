// src/controllers/sesionController.js
const Sesion = require('../models/Sesion');
const Unidad = require('../models/Unidad');
const Curso = require('../models/Curso');

const sesionController = {
  // Obtener todas las sesiones
  getAllSesiones: async (req, res) => {
    try {
      const sesiones = await Sesion.findAll({
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
        order: [['numero_sesion', 'ASC']]
      });
      
      res.status(200).json({
        success: true,
        data: sesiones,
        message: 'Sesiones obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener sesiones:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener sesiones por unidad
  getSesionesByUnidad: async (req, res) => {
    try {
      const { unidadId } = req.params;
      
      const sesiones = await Sesion.findAll({
        where: { id_unidad: unidadId },
        include: [{
          model: Unidad,
          as: 'unidad',
          attributes: ['titulo_unidad']
        }],
        order: [['numero_sesion', 'ASC']]
      });

      res.status(200).json({
        success: true,
        data: sesiones,
        message: 'Sesiones de la unidad obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener sesiones por unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener sesión por ID
  getSesionById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const sesion = await Sesion.findByPk(id, {
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

      if (!sesion) {
        return res.status(404).json({
          success: false,
          message: 'Sesión no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: sesion,
        message: 'Sesión obtenida exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener sesión:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Crear nueva sesión
  createSesion: async (req, res) => {
    try {
      const { titulo_sesion, descripcion, numero_sesion, fecha_sesion, id_unidad } = req.body;

      // Validar campos requeridos
      if (!titulo_sesion || !numero_sesion || !id_unidad) {
        return res.status(400).json({
          success: false,
          message: 'Los campos titulo_sesion, numero_sesion e id_unidad son obligatorios'
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

      // Verificar que no exista otra sesión con el mismo número en la unidad
      const sesionExistente = await Sesion.findOne({
        where: { 
          numero_sesion,
          id_unidad 
        }
      });

      if (sesionExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una sesión con ese número en la unidad'
        });
      }

      const nuevaSesion = await Sesion.create({
        titulo_sesion,
        descripcion,
        numero_sesion,
        fecha_sesion,
        id_unidad,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Obtener la sesión creada con la unidad incluida
      const sesionCompleta = await Sesion.findByPk(nuevaSesion.id_sesion, {
        include: [{
          model: Unidad,
          as: 'unidad',
          attributes: ['titulo_unidad']
        }]
      });

      res.status(201).json({
        success: true,
        data: sesionCompleta,
        message: 'Sesión creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear sesión:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar sesión
  updateSesion: async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo_sesion, descripcion, numero_sesion, fecha_sesion } = req.body;

      const sesion = await Sesion.findByPk(id);
      
      if (!sesion) {
        return res.status(404).json({
          success: false,
          message: 'Sesión no encontrada'
        });
      }

      // Si se está actualizando el número de sesión, verificar que no exista duplicado
      if (numero_sesion && numero_sesion !== sesion.numero_sesion) {
        const sesionExistente = await Sesion.findOne({
          where: { 
            numero_sesion,
            id_unidad: sesion.id_unidad,
            id_sesion: { [require('sequelize').Op.ne]: id }
          }
        });

        if (sesionExistente) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe una sesión con ese número en la unidad'
          });
        }
      }

      await sesion.update({
        titulo_sesion: titulo_sesion || sesion.titulo_sesion,
        descripcion: descripcion !== undefined ? descripcion : sesion.descripcion,
        numero_sesion: numero_sesion || sesion.numero_sesion,
        fecha_sesion: fecha_sesion !== undefined ? fecha_sesion : sesion.fecha_sesion,
        updated_at: new Date()
      });

      const sesionActualizada = await Sesion.findByPk(id, {
        include: [{
          model: Unidad,
          as: 'unidad',
          attributes: ['titulo_unidad']
        }]
      });

      res.status(200).json({
        success: true,
        data: sesionActualizada,
        message: 'Sesión actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar sesión:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar sesión
  deleteSesion: async (req, res) => {
    try {
      const { id } = req.params;

      const sesion = await Sesion.findByPk(id);
      
      if (!sesion) {
        return res.status(404).json({
          success: false,
          message: 'Sesión no encontrada'
        });
      }

      // Nota: Aquí podrías verificar si tiene actividades asociadas
      // cuando implementes el modelo de Actividad

      await sesion.destroy();

      res.status(200).json({
        success: true,
        message: 'Sesión eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar sesión:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = sesionController;