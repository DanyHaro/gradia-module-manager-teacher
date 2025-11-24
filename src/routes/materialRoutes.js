const express = require('express');
const router = express.Router();
const multer = require("multer");
const materialController = require('../controllers/materialController');
const authenticate = require('../middlewares/authenticate');

// Multer: Valida .docx solo si es rúbrica, permite cualquier formato para materiales
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB límite
  fileFilter: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase();
    const esRubrica = fileName.includes("rubrica") || fileName.includes("rúbrica");

    // Si es rúbrica, validar que sea .docx
    if (esRubrica && !file.originalname.endsWith(".docx")) {
      return cb(new Error("Las rúbricas solo se permiten en formato .docx"));
    }

    // Material de apoyo: cualquier formato permitido
    cb(null, true);
  }
});

// 🔐 Todas requieren login
router.use(authenticate);

// Subir archivo + crear material (Word + JSON si es rúbrica)
router.post("/", upload.single("archivo"), materialController.createMaterial);

// CRUD
router.get("/", materialController.getAllMateriales);
router.get("/actividad/:actividadId", materialController.getMaterialesByActividad);
router.get("/:id", materialController.getMaterialById);
router.put("/:id", upload.single("archivo"), materialController.updateMaterial);
router.delete("/:id", materialController.deleteMaterial);

module.exports = router;
