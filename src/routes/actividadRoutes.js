// src/routes/actividadRoutes.js
const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');

// Rutas para actividades
router.get('/', actividadController.getAllActividades);
router.get('/sesion/:sesionId', actividadController.getActividadesBySesion);
router.get('/:id', actividadController.getActividadById);
router.post('/', actividadController.createActividad);
router.put('/:id', actividadController.updateActividad);
router.delete('/:id', actividadController.deleteActividad);

module.exports = router;