const Plan = require('../models/planesModel');

// Valida los datos que llegan en el body. Devuelve la lista de errores (vacía si todo está bien).
const validar = (d) => {
    const errores = [];
    if (!d.nombre || String(d.nombre).trim() === '') errores.push('nombre es obligatorio');
    if (!d.descripcion || String(d.descripcion).trim() === '') errores.push('descripcion es obligatorio');
    if (!Number.isInteger(Number(d.duracion_dias)) || Number(d.duracion_dias) <= 0) errores.push('duracion_dias debe ser un número entero mayor a 0');
    if (d.precio === undefined || d.precio === '' || isNaN(Number(d.precio)) || Number(d.precio) <= 0) errores.push('precio debe ser un número mayor a 0');
    return errores;
};

// Verifica que el id de la URL sea un entero positivo.
const idValido = (valor) => Number.isInteger(Number(valor)) && Number(valor) > 0;

// GET /api/planes
exports.getPlanes = (req, res, next) => {
    Plan.getAll((err, rows) => {
        if (err) return next(err);
        res.status(200).json({ ok: true, total: rows.length, data: rows });
    });
};

// GET /api/planes/:id
exports.getPlanById = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Plan.getById(req.params.id, (err, rows) => {
        if (err) return next(err);
        if (rows.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Plan no encontrado' });
        }
        res.status(200).json({ ok: true, data: rows[0] });
    });
};

// POST /api/planes
exports.postPlan = (req, res, next) => {
    const d = req.body || {};
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Plan.create(d, (err, result) => {
        if (err) return next(err);
        res.status(201).json({
            ok: true,
            mensaje: 'Plan creado correctamente',
            data: { id_plan: result.insertId, ...d }
        });
    });
};

// PUT /api/planes/:id  (reemplaza todos los campos del registro)
exports.putPlan = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    const d = req.body || {};
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Plan.update(req.params.id, d, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Plan no encontrado' });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Plan actualizado correctamente',
            data: { id_plan: Number(req.params.id), ...d }
        });
    });
};

// DELETE /api/planes/:id
exports.deletePlan = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Plan.remove(req.params.id, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Plan no encontrado' });
        }
        res.status(200).json({ ok: true, mensaje: 'Plan eliminado correctamente' });
    });
};
