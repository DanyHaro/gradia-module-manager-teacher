const MaterialActividad = require('../models/MaterialUnidad');
const { Actividad } = require('../models/associations');
const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const mammoth = require("mammoth");
const path = require("path");


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  }
});

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

    console.log(`[DEBUG] Materiales solicitados para actividad ${actividadId}: ${materiales.length} encontrados.`);

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


// ================== PARSER DE RÚBRICA (Word → JSON) ==================
function parseRubricaFromText(textoPlano, id_actividad) {
  // Normalizar saltos de línea
  const texto = textoPlano.replace(/\r\n/g, '\n').trim();

  // Intentar sacar el título (línea que empieza con "RÚBRICA")
  const tituloMatch = texto.match(/RÚBRICA[^\n]*/i);
  const titulo = tituloMatch ? tituloMatch[0].trim() : "Rúbrica de Evaluación";

  const criterios = [];

  // Bloques tipo: "CRITERIO 1 ... (hasta antes de CRITERIO 2 / fin de texto)"
  const criterioRegex = /CRITERIO\s+(\d+)[\s\S]*?(?=CRITERIO\s+\d+|$)/gi;
  let match;

  while ((match = criterioRegex.exec(texto)) !== null) {
    const indice = parseInt(match[1], 10);
    const bloque = match[0];

    // Descripción del criterio
    const descMatch = bloque.match(/Descripción del criterio:\s*([\s\S]*?)\s*Puntaje Máximo:/i);
    const descripcion = descMatch
      ? descMatch[1].replace(/\s+/g, " ").trim()
      : null;

    // Puntaje máximo
    const maxMatch = bloque.match(/Puntaje Máximo:\s*(\d+)/i);
    const puntajeMaximo = maxMatch ? parseInt(maxMatch[1], 10) : null;

    // Función helper para extraer cada nivel (A, B, C, D)
    const extraerNivel = (letra) => {
      // Ejemplo de línea:
      // • A (18–20 puntos): Texto...
      const nivelRegex = new RegExp(
        `[•\\-]?\\s*${letra}\\s*\\((\\d+)[^0-9]+(\\d+)\\s*puntos?\\):\\s*([^\\n]+)`,
        "i"
      );
      const m = bloque.match(nivelRegex);
      if (!m) return null;

      return {
        etiqueta: letra,
        rango_min: parseInt(m[1], 10),
        rango_max: parseInt(m[2], 10),
        descripcion: m[3].trim()
      };
    };

    const nivelA = extraerNivel("A");
    const nivelB = extraerNivel("B");
    const nivelC = extraerNivel("C");
    const nivelD = extraerNivel("D");

    criterios.push({
      indice,
      nombre: `Criterio ${indice}`,
      descripcion,
      puntaje_maximo: puntajeMaximo,
      niveles: {
        A: nivelA,
        B: nivelB,
        C: nivelC,
        D: nivelD,
      }
    });
  }

  return {
    id_actividad,
    titulo,
    criterios,
  };
}

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
// =====================================================
// ===============   CREAR MATERIAL   ====================
// =====================================================

exports.createMaterial = async (req, res) => {
  try {
    const { id_actividad } = req.body;

    // 1️⃣ Validación
    if (!id_actividad) {
      return res.status(400).json({
        success: false,
        message: "El campo id_actividad es obligatorio",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Debes subir un archivo",
      });
    }

    // 2️⃣ Verificar actividad
    const actividad = await Actividad.findByPk(id_actividad);
    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    }

    // 3️⃣ Detectar si es rúbrica
    const originalName = req.file.originalname.toLowerCase();
    const esRubrica =
      originalName.includes("rubrica") ||
      originalName.includes("rúbrica");

    const timestamp = Date.now();
    const ext = path.extname(req.file.originalname) || "";

    // 4️⃣ Crear registro inicial (para obtener id_documento_actividad)
    const nuevoMaterial = await MaterialActividad.create({
      id_actividad,
      nombre_documento: req.file.originalname,
      tipo_documento: ext.replace(".", "") || "unknown",
      url_archivo: "TEMP"
    });

    // 5️⃣ Determinar carpeta y nombre del archivo en S3
    const carpeta = esRubrica ? "rubricas" : "materiales";
    const tipo = esRubrica ? "rubrica" : "material";
    const filename = `${carpeta}/${tipo}-${nuevoMaterial.id_documento_actividad}-${id_actividad}-${timestamp}${ext}`;

    // 6️⃣ Subir archivo a S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    // =====================================================
    // ===============  SI ES RÚBRICA → JSON ===============
    // =====================================================
    if (esRubrica && ext === ".docx") {
      try {
        const { value: textoPlano } = await mammoth.extractRawText({
          buffer: req.file.buffer,
        });

        const jsonRubrica = parseRubricaFromText(textoPlano, id_actividad);

        const filenameJson = `rubricas/rubrica-${nuevoMaterial.id_documento_actividad}-${id_actividad}-${timestamp}.json`;

        await s3.send(new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: filenameJson,
          Body: Buffer.from(JSON.stringify(jsonRubrica, null, 2)),
          ContentType: "application/json",
        }));
      } catch (err) {
        console.warn("⚠️ No se pudo procesar la rúbrica a JSON:", err.message);
      }
    }

    // 7️⃣ Actualizamos la URL final del archivo en la BD
    await nuevoMaterial.update({ url_archivo: fileUrl });

    return res.status(201).json({
      success: true,
      data: nuevoMaterial,
      message: esRubrica
        ? "Rúbrica subida y procesada correctamente"
        : "Material subido correctamente",
    });

  } catch (error) {
    console.error("Error al crear material:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};


// Actualizar material
// =====================================================
// ===============   ACTUALIZAR MATERIAL   =============
// =====================================================
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await MaterialActividad.findByPk(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material no encontrado"
      });
    }

    const { id_actividad, id_documento_actividad } = material;

    // =====================================================
    // 1️⃣ Si NO hay archivo → actualizar solo campos
    // =====================================================
    if (!req.file) {
      const { nombre_documento, tipo_documento } = req.body;

      await material.update({
        nombre_documento: nombre_documento || material.nombre_documento,
        tipo_documento: tipo_documento || material.tipo_documento
      });

      return res.status(200).json({
        success: true,
        data: material,
        message: "Material actualizado correctamente (sin archivo)"
      });
    }

    // =====================================================
    // 2️⃣ SI HAY ARCHIVO → REEMPLAZO COMPLETO
    // =====================================================

    // ----- BORRAR WORD ANTERIOR -----
    try {
      const oldKey = material.url_archivo.split(".amazonaws.com/")[1];
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: oldKey
      }));
    } catch (err) { }


    // =====================================================
    // 3️⃣ SI ES RÚBRICA → BUSCAR Y BORRAR JSONS ANTIGUOS
    // =====================================================
    const prefixJson = `rubricas/rubrica-${id_documento_actividad}-${id_actividad}`;

    // Buscar JSONs que tengan ese prefijo
    let listResp = null;

    try {
      listResp = await s3.send(
        new ListObjectsV2Command({
          Bucket: process.env.AWS_BUCKET,
          Prefix: prefixJson
        })
      );
    } catch (err) {
      console.warn("⚠ Error al buscar JSON antiguo:", err);
    }

    if (listResp && listResp.Contents) {
      for (const obj of listResp.Contents) {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: obj.Key
        }));
      }
    }

    // =====================================================
    // 4️⃣ GENERAR NUEVO NOMBRE CON TIMESTAMP
    // =====================================================
    const timestamp = Date.now();
    const originalName = req.file.originalname.toLowerCase();
    const esRubrica =
      originalName.includes("rubrica") ||
      originalName.includes("rúbrica");

    const tipo = esRubrica ? "rubrica" : "actividad";
    const ext = path.extname(req.file.originalname) || ".docx";

    const newFilenameWord =
      `rubricas/${tipo}-${id_documento_actividad}-${id_actividad}-${timestamp}${ext}`;

    // =====================================================
    // 5️⃣ SUBIR WORD NUEVO
    // =====================================================
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: newFilenameWord,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    const newWordUrl =
      `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${newFilenameWord}`;


    // =====================================================
    // 6️⃣ SI ES RÚBRICA → GENERAR JSON Y SUBIRLO
    // =====================================================
    if (esRubrica) {
      const { value: textoPlano } = await mammoth.extractRawText({
        buffer: req.file.buffer
      });

      const jsonRubrica = parseRubricaFromText(textoPlano, id_actividad);

      const filenameJson =
        `rubricas/rubrica-${id_documento_actividad}-${id_actividad}-${timestamp}.json`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: filenameJson,
        Body: Buffer.from(JSON.stringify(jsonRubrica, null, 2)),
        ContentType: "application/json"
      }));
    }

    // =====================================================
    // 7️⃣ ACTUALIZAR BD
    // =====================================================
    await material.update({
      nombre_documento: req.file.originalname,
      tipo_documento: ext.replace(".", ""),
      url_archivo: newWordUrl
    });

    return res.status(200).json({
      success: true,
      data: material,
      message: "Material actualizado correctamente"
    });

  } catch (error) {
    console.error("❌ Error al actualizar material:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};


// Eliminar material
// =====================================================
// ===============   ELIMINAR MATERIAL   ===============
// =====================================================
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await MaterialActividad.findByPk(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material no encontrado"
      });
    }

    const { id_actividad, id_documento_actividad } = material;

    // =====================================================
    // 1️⃣ BORRAR WORD EN S3
    // =====================================================
    try {
      const key = material.url_archivo.split(".amazonaws.com/")[1];

      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key
      }));

    } catch (err) {
      console.warn("⚠ No se pudo borrar el Word.");
    }

    // =====================================================
    // 2️⃣ SI ES RÚBRICA → BORRAR TODOS LOS JSON RELACIONADOS
    // =====================================================
    const esRubrica = material.nombre_documento.toLowerCase().includes("rubrica");

    if (esRubrica) {
      const prefix = `rubricas/rubrica-${id_documento_actividad}-${id_actividad}`;

      try {
        const list = await s3.send(new ListObjectsV2Command({
          Bucket: process.env.AWS_BUCKET,
          Prefix: prefix
        }));

        if (list && list.Contents) {
          for (const obj of list.Contents) {
            await s3.send(new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET,
              Key: obj.Key
            }));
          }
        }

      } catch (err) {
        console.warn("⚠ No se encontraron JSON previos.");
      }
    }

    // =====================================================
    // 3️⃣ BORRAR DE BD
    // =====================================================
    await material.destroy();

    return res.status(200).json({
      success: true,
      message: "Material eliminado correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar material:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};



// Subir archivo
/*exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    // Construir la URL del archivo
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/materials/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      },
      message: 'Archivo subido exitosamente'
    });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir el archivo',
      error: error.message
    });
  }
};

*/
