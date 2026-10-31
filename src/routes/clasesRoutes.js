const express = require('express');
const router = express.Router();
const controller = require('../controllers/clasesController');

router.get('/', controller.getClases);
router.get('/:id', controller.getClaseById);
router.post('/', controller.postClase);
router.put('/:id', controller.putClase);
router.delete('/:id', controller.deleteClase);

module.exports = router;
