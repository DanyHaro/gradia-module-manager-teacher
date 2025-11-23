const express = require('express');
const router = express.Router();
const multer = require("multer");
const materialController = require('../controllers/materialController');
const authenticate = require('../middlewares/authenticate');

// Multer solo permite .docx
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith(".docx")) {
      return cb(new Error("Solo se permite subir archivos .docx"));
    }
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
