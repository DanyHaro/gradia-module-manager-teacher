// src/routes/rubricaRoutes.js
const express = require('express');
const router = express.Router();
const rubricaController = require('../controllers/rubricaController');

// Rutas para gestión de rúbricas (vista docente)
router.get('/', rubricaController.getAllRubricas);
router.get('/:id', rubricaController.getRubricaById);
router.post('/', rubricaController.createRubrica);
router.put('/:id', rubricaController.updateRubrica);
router.delete('/:id', rubricaController.deleteRubrica);
router.post('/:id/duplicate', rubricaController.duplicateRubrica);

module.exports = router;