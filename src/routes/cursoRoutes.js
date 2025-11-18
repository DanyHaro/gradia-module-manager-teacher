// routes/cursoRoutes.js
const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const authenticate = require('../middlewares/authenticate');

// 🔒 Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para cursos
router.get('/', cursoController.getAllCursos);
router.get('/:id', cursoController.getCursoById);

// ❌ DESHABILITADO: Los cursos los crea ADMIN directamente en BD
// Solo docentes pueden ver cursos donde están inscritos
// router.post('/', cursoController.createCurso);
// router.put('/:id', cursoController.updateCurso);
// router.delete('/:id', cursoController.deleteCurso);

module.exports = router;