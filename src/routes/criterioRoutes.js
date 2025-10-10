// src/routes/criterioRoutes.js
const express = require('express');
const router = express.Router();
const criterioController = require('../controllers/criterioController');

// Rutas para gestión de criterios (vista docente)
router.get('/', criterioController.getAllCriterios);
router.get('/search', criterioController.searchCriterios);
router.get('/:id', criterioController.getCriterioById);
router.post('/', criterioController.createCriterio);
router.put('/:id', criterioController.updateCriterio);
router.delete('/:id', criterioController.deleteCriterio);

module.exports = router;