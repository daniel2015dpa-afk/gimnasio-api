const express = require('express');
const router = express.Router();
const controller = require('../controllers/inscripcionesController');

router.get('/', controller.getInscripciones);
router.get('/:id', controller.getInscripcionById);
router.post('/', controller.postInscripcion);
router.put('/:id', controller.putInscripcion);
router.delete('/:id', controller.deleteInscripcion);

module.exports = router;
