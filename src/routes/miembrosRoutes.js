const express = require('express');
const router = express.Router();
const controller = require('../controllers/miembrosController');

router.get('/', controller.getMiembros);
// IMPORTANTE: '/detalle' va antes de '/:id', si no Express lo tomaría como un id
router.get('/detalle', controller.getMiembrosDetalle);
router.get('/:id', controller.getMiembroById);
router.post('/', controller.postMiembro);
router.put('/:id', controller.putMiembro);
router.delete('/:id', controller.deleteMiembro);

module.exports = router;
