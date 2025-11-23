// src/middlewares/uploadMiddleware.js
const multer = require("multer");

// === Almacenamiento en memoria ===
// Necesario para enviar archivos directamente a S3
const storage = multer.memoryStorage();

// === Filtro de archivos (opcional) ===
// Aquí puedes bloquear tipos si quieres, por ahora NO bloqueamos nada
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

// === Configuración principal ===
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 200MB máximo
  },
});

// === Exportar variantes ===
module.exports = {
  uploadSingle: upload.single("archivo"),   // 1 archivo → req.file
  uploadArray: upload.array("archivos"),    // varios archivos → req.files
  upload,                                   // para casos avanzados
};
