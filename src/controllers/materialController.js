const MaterialActividad = require('../models/MaterialUnidad');
const { Actividad } = require('../models/associations');

// Obtener todos los materiales
exports.getAllMateriales = async (req, res) => {
  try {
    const materiales = await MaterialActividad.findAll({
      include: [
        {
          model: Actividad,
          as: 'actividad',
          attributes: ['id_actividad', 'nombre_actividad', 'tipo_actividad', 'id_unidad']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: materiales,
      message: 'Materiales obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener materiales por actividad
exports.getMaterialesByActividad = async (req, res) => {
  try {
    const { actividadId } = req.params;

    const actividad = await Actividad.findByPk(actividadId);
    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }

    const materiales = await MaterialActividad.findAll({
      where: { id_actividad: actividadId },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: materiales,
      message: 'Materiales de la actividad obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener materiales por actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener material por ID
exports.getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await MaterialActividad.findByPk(id, {
      include: [
        {
          model: Actividad,
          as: 'actividad',
          attributes: ['id_actividad', 'nombre_actividad', 'tipo_actividad']
        }
      ]
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: material,
      message: 'Material obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener material:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear material
exports.createMaterial = async (req, res) => {
  try {
    const { id_actividad, nombre_documento, tipo_documento, url_archivo } = req.body;

    // Validar campos requeridos
    if (!id_actividad || !nombre_documento || !url_archivo) {
      return res.status(400).json({
        success: false,
        message: 'Los campos id_actividad, nombre_documento y url_archivo son obligatorios'
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

    const nuevoMaterial = await MaterialActividad.create({
      id_actividad,
      nombre_documento,
      tipo_documento: tipo_documento || 'pdf',
      url_archivo
    });

    res.status(201).json({
      success: true,
      data: nuevoMaterial,
      message: 'Material creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear material:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar material
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_documento, tipo_documento, url_archivo } = req.body;

    const material = await MaterialActividad.findByPk(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material no encontrado'
      });
    }

    // Actualizar solo campos proporcionados
    const datosActualizados = {};
    if (nombre_documento) datosActualizados.nombre_documento = nombre_documento;
    if (tipo_documento) datosActualizados.tipo_documento = tipo_documento;
    if (url_archivo) datosActualizados.url_archivo = url_archivo;

    await material.update(datosActualizados);

    res.status(200).json({
      success: true,
      data: material,
      message: 'Material actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar material:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await MaterialActividad.findByPk(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material no encontrado'
      });
    }

    await material.destroy();

    res.status(200).json({
      success: true,
      message: 'Material eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar material:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
