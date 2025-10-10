// src/routes/evaluacionRoutes.js
const express = require('express');
const router = express.Router();
const evaluacionController = require('../controllers/evaluacionController');

// Rutas para gestión de evaluaciones (vista docente)
router.get('/', evaluacionController.getAllEvaluaciones);
router.get('/entrega/:entregaId', evaluacionController.getEvaluacionesByEntrega);
router.get('/estadisticas', evaluacionController.getEstadisticasEvaluaciones);
router.get('/:id', evaluacionController.getEvaluacionById);
router.post('/', evaluacionController.createEvaluacion);
router.put('/:id', evaluacionController.updateEvaluacion);
router.delete('/:id', evaluacionController.deleteEvaluacion);

module.exports = router;