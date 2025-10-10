const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// Rutas de materiales (documentos de actividad)
router.get('/', materialController.getAllMateriales);
router.get('/actividad/:actividadId', materialController.getMaterialesByActividad);
router.get('/:id', materialController.getMaterialById);
router.post('/', materialController.createMaterial);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;
