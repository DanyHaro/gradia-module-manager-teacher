// controllers/unidadController.js
const Unidad = require('../models/Unidad');
const Curso = require('../models/Curso');
const { verificarInscripcionEnCurso } = require('../utils/inscripcionHelper');

const unidadController = {
  // Obtener todas las unidades
  getAllUnidades: async (req, res) => {
    try {
      const unidades = await Unidad.findAll({
        include: [{
          model: Curso,
          as: 'curso',
          attributes: ['id_curso', 'nombre_curso']
        }],
        order: [['numero_unidad', 'ASC']]
      });
      
      res.status(200).json({
        success: true,
        data: unidades,
        message: 'Unidades obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener unidades:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener unidades por curso
  getUnidadesByCurso: async (req, res) => {
    try {
      const { cursoId } = req.params;
      
      const unidades = await Unidad.findAll({
        where: { id_curso: cursoId },
        include: [{
          model: Curso,
          as: 'curso',
          attributes: ['nombre_curso']
        }],
        order: [['numero_unidad', 'ASC']]
      });

      res.status(200).json({
        success: true,
        data: unidades,
        message: 'Unidades del curso obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener unidades por curso:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener unidad por ID
  getUnidadById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const unidad = await Unidad.findByPk(id, {
        include: [{
          model: Curso,
          as: 'curso',
          attributes: ['id_curso', 'nombre_curso']
        }]
      });

      if (!unidad) {
        return res.status(404).json({
          success: false,
          message: 'Unidad no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: unidad,
        message: 'Unidad obtenida exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Crear nueva unidad
  createUnidad: async (req, res) => {
    try {
      const { titulo_unidad, descripcion, numero_unidad, id_curso } = req.body;
      const userId = req.user.id;

      // Validar campos requeridos
      if (!titulo_unidad || !numero_unidad || !id_curso) {
        return res.status(400).json({
          success: false,
          message: 'Los campos titulo_unidad, numero_unidad e id_curso son obligatorios'
        });
      }

      // Verificar que el docente esté inscrito en el curso
      const estaInscrito = await verificarInscripcionEnCurso(userId, id_curso);

      if (!estaInscrito) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para crear unidades en este curso. Solo puedes gestionar cursos donde estás inscrito.'
        });
      }

      // Verificar que el curso existe
      const cursoExiste = await Curso.findByPk(id_curso);
      if (!cursoExiste) {
        return res.status(404).json({
          success: false,
          message: 'El curso especificado no existe'
        });
      }

      // Verificar que no exista otra unidad con el mismo número en el curso
      const unidadExistente = await Unidad.findOne({
        where: { 
          numero_unidad,
          id_curso 
        }
      });

      if (unidadExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una unidad con ese número en el curso'
        });
      }

      const nuevaUnidad = await Unidad.create({
        titulo_unidad,
        descripcion,
        numero_unidad,
        id_curso,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Obtener la unidad creada con el curso incluido
      const unidadCompleta = await Unidad.findByPk(nuevaUnidad.id_unidad, {
        include: [{
          model: Curso,
          as: 'curso',
          attributes: ['nombre_curso']
        }]
      });

      res.status(201).json({
        success: true,
        data: unidadCompleta,
        message: 'Unidad creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar unidad
  updateUnidad: async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo_unidad, descripcion, numero_unidad } = req.body;

      const unidad = await Unidad.findByPk(id);
      
      if (!unidad) {
        return res.status(404).json({
          success: false,
          message: 'Unidad no encontrada'
        });
      }

      // Si se está actualizando el número de unidad, verificar que no exista duplicado
      if (numero_unidad && numero_unidad !== unidad.numero_unidad) {
        const unidadExistente = await Unidad.findOne({
          where: { 
            numero_unidad,
            id_curso: unidad.id_curso,
            id_unidad: { [require('sequelize').Op.ne]: id }
          }
        });

        if (unidadExistente) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe una unidad con ese número en el curso'
          });
        }
      }

      await unidad.update({
        titulo_unidad: titulo_unidad || unidad.titulo_unidad,
        descripcion: descripcion !== undefined ? descripcion : unidad.descripcion,
        numero_unidad: numero_unidad || unidad.numero_unidad,
        updated_at: new Date()
      });

      const unidadActualizada = await Unidad.findByPk(id, {
        include: [{
          model: Curso,
          as: 'curso',
          attributes: ['nombre_curso']
        }]
      });

      res.status(200).json({
        success: true,
        data: unidadActualizada,
        message: 'Unidad actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar unidad
  deleteUnidad: async (req, res) => {
    try {
      const { id } = req.params;

      const unidad = await Unidad.findByPk(id);
      
      if (!unidad) {
        return res.status(404).json({
          success: false,
          message: 'Unidad no encontrada'
        });
      }

      await unidad.destroy();

      res.status(200).json({
        success: true,
        message: 'Unidad eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = unidadController;