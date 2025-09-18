// routes/unidadRoutes.js
const express = require('express');
const router = express.Router();
const unidadController = require('../controllers/unidadController');

// Rutas para unidades
router.get('/', unidadController.getAllUnidades);
router.get('/curso/:cursoId', unidadController.getUnidadesByCurso);
router.get('/:id', unidadController.getUnidadById);
router.post('/', unidadController.createUnidad);
router.put('/:id', unidadController.updateUnidad);
router.delete('/:id', unidadController.deleteUnidad);

module.exports = router;