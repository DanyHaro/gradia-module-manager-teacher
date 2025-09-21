// src/routes/entregaRoutes.js
const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');

// Rutas para gestión de entregas (vista docente)
router.get('/', entregaController.getAllEntregas);
router.get('/actividad/:actividadId', entregaController.getEntregasByActividad);
router.get('/curso/:cursoId', entregaController.getEntregasByCurso);
router.get('/usuario/:usuarioId', entregaController.getEntregasByUsuario);
router.get('/estadisticas', entregaController.getEstadisticasEntregas);
router.get('/:id', entregaController.getEntregaById);

// Rutas de gestión (solo para docentes)
router.delete('/:id', entregaController.deleteEntrega);
router.delete('/:entregaId/archivo/:archivoId', entregaController.deleteArchivoEntrega);

// NOTA: El POST (crear entregas) irá en el controlador de estudiantes
// Los estudiantes crearán sus propias entregas

module.exports = router;