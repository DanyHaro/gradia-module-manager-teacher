const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const materialController = require('../controllers/materialController');
const authenticate = require('../middlewares/authenticate');

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/materials');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único: timestamp_nombreoriginal
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, uniqueSuffix + '_' + nameWithoutExt + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Límite de 50MB
  },
  fileFilter: function (req, file, cb) {
    // Aceptar todos los tipos de archivos
    cb(null, true);
  }
});

// 🔒 Todas las rutas requieren autenticación
router.use(authenticate);

// Ruta para subir archivo
router.post('/upload', upload.single('file'), materialController.uploadFile);

// Rutas de materiales (documentos de actividad)
router.get('/', materialController.getAllMateriales);
router.get('/actividad/:actividadId', materialController.getMaterialesByActividad);
router.get('/:id', materialController.getMaterialById);
router.post('/', materialController.createMaterial);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;
