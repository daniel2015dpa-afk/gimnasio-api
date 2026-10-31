const express = require('express');
const router = express.Router();
const controller = require('../controllers/entrenadoresController');

router.get('/', controller.getEntrenadores);
router.get('/:id', controller.getEntrenadorById);
router.post('/', controller.postEntrenador);
router.put('/:id', controller.putEntrenador);
router.delete('/:id', controller.deleteEntrenador);

module.exports = router;
