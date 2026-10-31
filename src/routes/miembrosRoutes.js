const express = require('express');
const router = express.Router();
const controller = require('../controllers/miembrosController');

router.get('/', controller.getMiembros);
router.get('/:id', controller.getMiembroById);
router.post('/', controller.postMiembro);
router.put('/:id', controller.putMiembro);
router.delete('/:id', controller.deleteMiembro);

module.exports = router;
