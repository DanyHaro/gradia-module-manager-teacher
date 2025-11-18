const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const authenticate = require('../middlewares/authenticate');

// 🔒 Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de materiales (documentos de actividad)
router.get('/', materialController.getAllMateriales);
router.get('/actividad/:actividadId', materialController.getMaterialesByActividad);
router.get('/:id', materialController.getMaterialById);
router.post('/', materialController.createMaterial);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;
