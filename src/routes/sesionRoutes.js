// src/routes/sesionRoutes.js
const express = require('express');
const router = express.Router();
const sesionController = require('../controllers/sesionController');

router.get('/', sesionController.getAllSesiones);
router.get('/unidad/:unidadId', sesionController.getSesionesByUnidad);
router.get('/:id', sesionController.getSesionById);
router.post('/', sesionController.createSesion);
router.put('/:id', sesionController.updateSesion);
router.delete('/:id', sesionController.deleteSesion);

module.exports = router;