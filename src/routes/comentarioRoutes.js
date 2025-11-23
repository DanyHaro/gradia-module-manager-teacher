const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const authenticate = require('../middlewares/authenticate');

// 🔒 Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de comentarios
// Rutas de comentarios
router.get('/actividad/:actividadId', comentarioController.getComentariosByActividad);
router.post('/', comentarioController.createComentario);
router.delete('/:id', comentarioController.deleteComentario);

module.exports = router;
