const { Grupo, MiembroGrupo, Actividad, Entrega } = require('../models/associations');

// Obtener todos los grupos
exports.getAllGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.findAll({
      include: [
        {
          model: Actividad,
          as: 'actividad',
          attributes: ['id_actividad', 'nombre_actividad', 'tipo_actividad']
        },
        {
          model: MiembroGrupo,
          as: 'miembros',
          attributes: ['id_miembro', 'id_usuario', 'rol_miembro', 'fecha_ingreso']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: grupos,
      message: 'Grupos obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener grupos por actividad
exports.getGruposByActividad = async (req, res) => {
  try {
    const { actividadId } = req.params;

    const actividad = await Actividad.findByPk(actividadId);
    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }

    const grupos = await Grupo.findAll({
      where: { id_actividad: actividadId },
      include: [
        {
          model: MiembroGrupo,
          as: 'miembros',
          attributes: ['id_miembro', 'id_usuario', 'rol_miembro', 'fecha_ingreso']
        }
      ],
      order: [['nombre_grupo', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: grupos,
      message: 'Grupos de la actividad obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener grupos por actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener grupo por ID
exports.getGrupoById = async (req, res) => {
  try {
    const { id } = req.params;

    const grupo = await Grupo.findByPk(id, {
      include: [
        {
          model: Actividad,
          as: 'actividad',
          attributes: ['id_actividad', 'nombre_actividad', 'tipo_actividad']
        },
        {
          model: MiembroGrupo,
          as: 'miembros',
          attributes: ['id_miembro', 'id_usuario', 'rol_miembro', 'fecha_ingreso']
        }
      ]
    });

    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: grupo,
      message: 'Grupo obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear grupo
exports.createGrupo = async (req, res) => {
  try {
    const { nombre_grupo, id_actividad } = req.body;

    // Validar campos requeridos
    if (!nombre_grupo || !id_actividad) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del grupo y el ID de actividad son obligatorios'
      });
    }

    // Verificar que la actividad existe
    const actividad = await Actividad.findByPk(id_actividad);
    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }

    // Validar que la actividad sea de tipo grupal
    if (actividad.tipo_actividad !== 'grupal') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden crear grupos para actividades de tipo grupal'
      });
    }

    // Prevenir duplicados
    const grupoExistente = await Grupo.findOne({
      where: { nombre_grupo, id_actividad }
    });
    if (grupoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un grupo con ese nombre en esta actividad'
      });
    }

    const nuevoGrupo = await Grupo.create({
      nombre_grupo,
      id_actividad
    });

    res.status(201).json({
      success: true,
      data: nuevoGrupo,
      message: 'Grupo creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar grupo
exports.updateGrupo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_grupo } = req.body;

    const grupo = await Grupo.findByPk(id);
    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado'
      });
    }

    // Validar campo requerido
    if (!nombre_grupo) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del grupo es obligatorio'
      });
    }

    // Prevenir duplicados
    const grupoExistente = await Grupo.findOne({
      where: {
        nombre_grupo,
        id_actividad: grupo.id_actividad
      }
    });
    if (grupoExistente && grupoExistente.id_grupo !== parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un grupo con ese nombre en esta actividad'
      });
    }

    await grupo.update({ nombre_grupo });

    res.status(200).json({
      success: true,
      data: grupo,
      message: 'Grupo actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar grupo
exports.deleteGrupo = async (req, res) => {
  try {
    const { id } = req.params;

    const grupo = await Grupo.findByPk(id);
    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado'
      });
    }

    // Verificar que no tenga entregas asociadas
    const entregasCount = await Entrega.count({
      where: { id_grupo: id }
    });
    if (entregasCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el grupo porque tiene entregas asociadas'
      });
    }

    await grupo.destroy();

    res.status(200).json({
      success: true,
      message: 'Grupo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Agregar miembro al grupo
exports.addMiembro = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, rol_miembro } = req.body;

    // Validar campos requeridos
    if (!id_usuario) {
      return res.status(400).json({
        success: false,
        message: 'El ID de usuario es obligatorio'
      });
    }

    // Verificar que el grupo existe
    const grupo = await Grupo.findByPk(id);
    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado'
      });
    }

    // Validar rol si se proporciona
    if (rol_miembro && !['líder', 'integrante'].includes(rol_miembro)) {
      return res.status(400).json({
        success: false,
        message: 'El rol debe ser "líder" o "integrante"'
      });
    }

    // Verificar que el usuario no esté ya en el grupo
    const miembroExistente = await MiembroGrupo.findOne({
      where: { id_grupo: id, id_usuario }
    });
    if (miembroExistente) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya es miembro de este grupo'
      });
    }

    const nuevoMiembro = await MiembroGrupo.create({
      id_grupo: id,
      id_usuario,
      rol_miembro: rol_miembro || 'integrante'
    });

    res.status(201).json({
      success: true,
      data: nuevoMiembro,
      message: 'Miembro agregado al grupo exitosamente'
    });
  } catch (error) {
    console.error('Error al agregar miembro al grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar miembro del grupo
exports.removeMiembro = async (req, res) => {
  try {
    const { id, miembroId } = req.params;

    const miembro = await MiembroGrupo.findOne({
      where: { id_miembro: miembroId, id_grupo: id }
    });

    if (!miembro) {
      return res.status(404).json({
        success: false,
        message: 'Miembro no encontrado en este grupo'
      });
    }

    await miembro.destroy();

    res.status(200).json({
      success: true,
      message: 'Miembro eliminado del grupo exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar miembro del grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
