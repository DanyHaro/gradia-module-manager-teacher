const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const authenticate = require('../middlewares/authenticate');

// 🔒 Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de grupos
router.get('/', grupoController.getAllGrupos);
router.get('/actividad/:actividadId', grupoController.getGruposByActividad);
router.get('/:id', grupoController.getGrupoById);
router.post('/', grupoController.createGrupo);
router.put('/:id', grupoController.updateGrupo);
router.delete('/:id', grupoController.deleteGrupo);

// Rutas de miembros de grupo
router.post('/:id/miembros', grupoController.addMiembro);
router.delete('/:id/miembros/:miembroId', grupoController.removeMiembro);

module.exports = router;
