const { Comentario, Usuario, Persona } = require('../models/associations');

const comentarioController = {
  // Obtener comentarios de una actividad
  getComentariosByActividad: async (req, res) => {
    try {
      const { actividadId } = req.params;

      console.log(`🔍 Obteniendo comentarios para actividad ${actividadId}`);

      const comentarios = await Comentario.findAll({
        where: {
          id_actividad: parseInt(actividadId),
          parent_id: null // Solo comentarios principales, las respuestas se cargan anidadas
        },
        include: [
          {
            model: Usuario,
            as: 'usuario',
            required: false, // LEFT JOIN para no excluir comentarios sin usuario
            attributes: ['id_usuario', 'correo_institucional'],
            include: [{
              model: Persona,
              as: 'persona',
              required: false, // LEFT JOIN para no excluir usuarios sin persona
              attributes: ['nombre', 'apellido']
            }]
          },
          {
            model: Comentario,
            as: 'respuestas',
            required: false, // LEFT JOIN para incluir comentarios sin respuestas
            include: [{
              model: Usuario,
              as: 'usuario',
              required: false,
              attributes: ['id_usuario', 'correo_institucional'],
              include: [{
                model: Persona,
                as: 'persona',
                required: false,
                attributes: ['nombre', 'apellido']
              }]
            }],
            order: [['created_at', 'ASC']] // Respuestas en orden cronológico
          }
        ],
        order: [['created_at', 'DESC']] // Comentarios más recientes primero
      });

      console.log(`✅ Encontrados ${comentarios.length} comentarios para actividad ${actividadId}`);

      res.status(200).json({
        success: true,
        data: comentarios,
        message: 'Comentarios obtenidos exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener comentarios:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Crear un comentario
  createComentario: async (req, res) => {
    try {
      const { id_actividad, contenido, parent_id } = req.body;
      const id_usuario = req.user.id; // Asumiendo que el middleware de auth añade user.id

      if (!id_actividad || !contenido) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos (id_actividad, contenido)'
        });
      }

      const nuevoComentario = await Comentario.create({
        id_actividad,
        id_usuario,
        contenido,
        parent_id: parent_id || null,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Devolver el comentario con datos del usuario para actualizar el frontend inmediatamente
      const comentarioCompleto = await Comentario.findByPk(nuevoComentario.id_comentario, {
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

      res.status(201).json({
        success: true,
        data: comentarioCompleto,
        message: 'Comentario creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar un comentario
  deleteComentario: async (req, res) => {
    try {
      const { id } = req.params;
      const id_usuario = req.user.id;

      const comentario = await Comentario.findByPk(id);

      if (!comentario) {
        return res.status(404).json({
          success: false,
          message: 'Comentario no encontrado'
        });
      }

      // Verificar que el usuario sea el autor (o un admin/profesor si se requiere)
      // Aquí asumimos que solo el autor puede borrar su comentario por ahora
      if (comentario.id_usuario !== id_usuario) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar este comentario'
        });
      }

      await comentario.destroy();

      res.status(200).json({
        success: true,
        message: 'Comentario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = comentarioController;
