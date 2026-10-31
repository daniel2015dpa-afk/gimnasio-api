const Inscripcion = require('../models/inscripcionesModel');

// Valida los datos que llegan en el body. Devuelve la lista de errores (vacía si todo está bien).
const validar = (d) => {
    const errores = [];
    if (!Number.isInteger(Number(d.id_miembro)) || Number(d.id_miembro) <= 0) errores.push('id_miembro debe ser un número entero mayor a 0');
    if (!Number.isInteger(Number(d.id_clase)) || Number(d.id_clase) <= 0) errores.push('id_clase debe ser un número entero mayor a 0');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.fecha_inscripcion || ''))) errores.push('fecha_inscripcion debe tener formato AAAA-MM-DD');
    return errores;
};

// Verifica que el id de la URL sea un entero positivo.
const idValido = (valor) => Number.isInteger(Number(valor)) && Number(valor) > 0;

// GET /api/inscripciones
exports.getInscripciones = (req, res, next) => {
    Inscripcion.getAll((err, rows) => {
        if (err) return next(err);
        res.status(200).json({ ok: true, total: rows.length, data: rows });
    });
};

// GET /api/inscripciones/:id
exports.getInscripcionById = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Inscripcion.getById(req.params.id, (err, rows) => {
        if (err) return next(err);
        if (rows.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Inscripción no encontrada' });
        }
        res.status(200).json({ ok: true, data: rows[0] });
    });
};

// POST /api/inscripciones
exports.postInscripcion = (req, res, next) => {
    const d = req.body || {};
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Inscripcion.create(d, (err, result) => {
        if (err) return next(err);
        res.status(201).json({
            ok: true,
            mensaje: 'Inscripción creada correctamente',
            data: { id_inscripcion: result.insertId, ...d }
        });
    });
};

// PUT /api/inscripciones/:id  (reemplaza todos los campos del registro)
exports.putInscripcion = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    const d = req.body || {};
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Inscripcion.update(req.params.id, d, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Inscripción no encontrada' });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Inscripción actualizada correctamente',
            data: { id_inscripcion: Number(req.params.id), ...d }
        });
    });
};

// DELETE /api/inscripciones/:id
exports.deleteInscripcion = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Inscripcion.remove(req.params.id, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Inscripción no encontrada' });
        }
        res.status(200).json({ ok: true, mensaje: 'Inscripción eliminada correctamente' });
    });
};
