const { Comentario, Entrega } = require('../models/associations');

// Obtener comentarios por entrega
exports.getComentariosByEntrega = async (req, res) => {
  try {
    const { entregaId } = req.params;

    const entrega = await Entrega.findByPk(entregaId);
    if (!entrega) {
      return res.status(404).json({
        success: false,
        message: 'Entrega no encontrada'
      });
    }

    const comentarios = await Comentario.findAll({
      where: { id_entrega: entregaId },
      order: [['fecha_comentario', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: comentarios,
      message: 'Comentarios obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener comentario por ID
exports.getComentarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const comentario = await Comentario.findByPk(id, {
      include: [
        {
          model: Entrega,
          as: 'entrega',
          attributes: ['id_entrega', 'id_actividad', 'id_usuario']
        }
      ]
    });

    if (!comentario) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: comentario,
      message: 'Comentario obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear comentario
exports.createComentario = async (req, res) => {
  try {
    const { id_entrega, id_usuario, contenido } = req.body;

    // Validar campos requeridos
    if (!id_entrega || !id_usuario || !contenido) {
      return res.status(400).json({
        success: false,
        message: 'La entrega, usuario y contenido son obligatorios'
      });
    }

    // Verificar que la entrega existe
    const entrega = await Entrega.findByPk(id_entrega);
    if (!entrega) {
      return res.status(404).json({
        success: false,
        message: 'Entrega no encontrada'
      });
    }

    const nuevoComentario = await Comentario.create({
      id_entrega,
      id_usuario,
      contenido
    });

    res.status(201).json({
      success: true,
      data: nuevoComentario,
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
};

// Actualizar comentario
exports.updateComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido, id_usuario } = req.body;

    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    // Validar campo requerido
    if (!contenido) {
      return res.status(400).json({
        success: false,
        message: 'El contenido es obligatorio'
      });
    }

    // Verificar que el usuario sea el autor (opcional: puedes validar con id_usuario del req)
    if (id_usuario && comentario.id_usuario !== id_usuario) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este comentario'
      });
    }

    await comentario.update({ contenido });

    res.status(200).json({
      success: true,
      data: comentario,
      message: 'Comentario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar comentario
exports.deleteComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.body;

    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    // Verificar que el usuario sea el autor (opcional: puedes validar con id_usuario del req)
    if (id_usuario && comentario.id_usuario !== id_usuario) {
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
};
