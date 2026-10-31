const Entrenador = require('../models/entrenadoresModel');

// Valida los datos que llegan en el body. Devuelve la lista de errores (vacía si todo está bien).
const validar = (d) => {
    const errores = [];
    if (!/^\d{6,15}$/.test(String(d.documento || ''))) errores.push('documento debe tener entre 6 y 15 dígitos');
    if (!d.nombre || String(d.nombre).trim() === '') errores.push('nombre es obligatorio');
    if (!d.apellido || String(d.apellido).trim() === '') errores.push('apellido es obligatorio');
    if (!d.especialidad || String(d.especialidad).trim() === '') errores.push('especialidad es obligatorio');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.correo || ''))) errores.push('correo no es un correo válido');
    if (!/^\d{7,10}$/.test(String(d.telefono || ''))) errores.push('telefono debe tener entre 7 y 10 dígitos');
    return errores;
};

// Verifica que el id de la URL sea un entero positivo.
const idValido = (valor) => Number.isInteger(Number(valor)) && Number(valor) > 0;

// GET /api/entrenadores
exports.getEntrenadores = (req, res, next) => {
    Entrenador.getAll((err, rows) => {
        if (err) return next(err);
        res.status(200).json({ ok: true, total: rows.length, data: rows });
    });
};

// GET /api/entrenadores/:id
exports.getEntrenadorById = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Entrenador.getById(req.params.id, (err, rows) => {
        if (err) return next(err);
        if (rows.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Entrenador no encontrado' });
        }
        res.status(200).json({ ok: true, data: rows[0] });
    });
};

// POST /api/entrenadores
exports.postEntrenador = (req, res, next) => {
    const d = req.body || {};
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Entrenador.create(d, (err, result) => {
        if (err) return next(err);
        res.status(201).json({
            ok: true,
            mensaje: 'Entrenador creado correctamente',
            data: { id_entrenador: result.insertId, ...d }
        });
    });
};

// PUT /api/entrenadores/:id  (reemplaza todos los campos del registro)
exports.putEntrenador = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    const d = req.body || {};
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Entrenador.update(req.params.id, d, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Entrenador no encontrado' });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Entrenador actualizado correctamente',
            data: { id_entrenador: Number(req.params.id), ...d }
        });
    });
};

// DELETE /api/entrenadores/:id
exports.deleteEntrenador = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Entrenador.remove(req.params.id, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Entrenador no encontrado' });
        }
        res.status(200).json({ ok: true, mensaje: 'Entrenador eliminado correctamente' });
    });
};
