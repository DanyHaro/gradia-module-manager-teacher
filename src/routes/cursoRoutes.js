// routes/cursoRoutes.js
const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const authenticate = require('../middlewares/authenticate');

// 🔒 Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para cursos - Solo lectura
// Los cursos se crean manualmente en BD por el ADMIN
router.get('/', cursoController.getAllCursos);
router.get('/:id', cursoController.getCursoById);

module.exports = router;