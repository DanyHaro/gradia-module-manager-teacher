// src/routes/actividadRoutes.js
const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');
const authenticate = require('../middlewares/authenticate');

// 🔒 Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para actividades
router.get('/', actividadController.getAllActividades);
router.get('/unidad/:unidadId', actividadController.getActividadesByUnidad);
router.get('/:id', actividadController.getActividadById);
router.post('/', actividadController.createActividad);
router.put('/:id', actividadController.updateActividad);
router.delete('/:id', actividadController.deleteActividad);

module.exports = router;