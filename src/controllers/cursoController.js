// controllers/cursoController.js
const Curso = require('../models/Curso');
const Unidad = require('../models/Unidad');
const Inscripcion = require('../models/Inscripcion');
const { verificarInscripcionEnCurso } = require('../utils/inscripcionHelper');

const cursoController = {
  // Obtener todos los cursos del docente autenticado (donde está inscrito)
  getAllCursos: async (req, res) => {
    try {
      const userId = req.user.id; // ID del docente autenticado desde JWT

      // Buscar cursos donde el docente está inscrito
      const cursos = await Curso.findAll({
        include: [
          {
            model: Inscripcion,
            as: 'inscripciones',
            where: { id_usuario: userId }, // Solo cursos donde está inscrito
            attributes: [] // No incluir datos de inscripción en respuesta
          },
          {
            model: Unidad,
            as: 'unidades',
            attributes: ['id_unidad', 'titulo_unidad', 'numero_unidad']
          }
        ],
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
      const userId = req.user.id;

      // Verificar que el docente esté inscrito en el curso
      const estaInscrito = await verificarInscripcionEnCurso(userId, id);

      if (!estaInscrito) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a este curso. Solo puedes ver cursos donde estás inscrito.'
        });
      }

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
  }

  // ❌ ELIMINADOS: createCurso, updateCurso, deleteCurso
  // Los cursos se crean manualmente en la BD por el ADMIN
  // Los docentes solo pueden ver cursos donde están inscritos
};

module.exports = cursoController;