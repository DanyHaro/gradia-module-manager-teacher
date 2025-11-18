const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const authenticate = require('../middlewares/authenticate');

// 🔒 Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de comentarios
router.get('/entrega/:entregaId', comentarioController.getComentariosByEntrega);
router.get('/:id', comentarioController.getComentarioById);
router.post('/', comentarioController.createComentario);
router.put('/:id', comentarioController.updateComentario);
router.delete('/:id', comentarioController.deleteComentario);

module.exports = router;
