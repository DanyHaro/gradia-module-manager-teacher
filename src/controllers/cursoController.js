// controllers/cursoController.js
const Curso = require('../models/Curso');
const Unidad = require('../models/Unidad');

const cursoController = {
  // Obtener todos los cursos
  getAllCursos: async (req, res) => {
    try {
      const cursos = await Curso.findAll({
        include: [{
          model: Unidad,
          as: 'unidades',
          attributes: ['id_unidad', 'titulo_unidad', 'numero_unidad']
        }],
        order: [['created_at', 'DESC']]
      });
      
      res.status(200).json({
        success: true,
        data: cursos,
        message: 'Cursos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener curso por ID
  getCursoById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const curso = await Curso.findByPk(id, {
        include: [{
          model: Unidad,
          as: 'unidades',
          order: [['numero_unidad', 'ASC']]
        }]
      });

      if (!curso) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: curso,
        message: 'Curso obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener curso:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Crear nuevo curso
  createCurso: async (req, res) => {
    try {
      const { nombre_curso, descripcion, id_usuario, estado = 'activo' } = req.body;

      // Validar campos requeridos
      if (!nombre_curso || !id_usuario) {
        return res.status(400).json({
          success: false,
          message: 'Los campos nombre_curso e id_usuario son obligatorios'
        });
      }

      const nuevoCurso = await Curso.create({
        nombre_curso,
        descripcion,
        estado,
        id_usuario,
        created_at: new Date(),
        updated_at: new Date()
      });

      res.status(201).json({
        success: true,
        data: nuevoCurso,
        message: 'Curso creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear curso:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar curso
  updateCurso: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre_curso, descripcion, estado } = req.body;

      const curso = await Curso.findByPk(id);
      
      if (!curso) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado'
        });
      }

      await curso.update({
        nombre_curso: nombre_curso || curso.nombre_curso,
        descripcion: descripcion !== undefined ? descripcion : curso.descripcion,
        estado: estado || curso.estado,
        updated_at: new Date()
      });

      res.status(200).json({
        success: true,
        data: curso,
        message: 'Curso actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar curso
  deleteCurso: async (req, res) => {
    try {
      const { id } = req.params;

      const curso = await Curso.findByPk(id);
      
      if (!curso) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado'
        });
      }

      // Verificar si tiene unidades asociadas
      const unidadesCount = await Unidad.count({
        where: { id_curso: id }
      });

      if (unidadesCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el curso porque tiene unidades asociadas'
        });
      }

      await curso.destroy();

      res.status(200).json({
        success: true,
        message: 'Curso eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = cursoController;