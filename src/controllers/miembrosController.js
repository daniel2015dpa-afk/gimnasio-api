const Miembro = require('../models/miembrosModel');

// Valida los datos que llegan en el body. Devuelve la lista de errores (vacía si todo está bien).
const validar = (d) => {
    const errores = [];
    if (!/^\d{6,15}$/.test(String(d.documento || ''))) errores.push('documento debe tener entre 6 y 15 dígitos');
    if (!d.nombre || String(d.nombre).trim() === '') errores.push('nombre es obligatorio');
    if (!d.apellido || String(d.apellido).trim() === '') errores.push('apellido es obligatorio');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.correo || ''))) errores.push('correo no es un correo válido');
    if (!/^\d{7,10}$/.test(String(d.telefono || ''))) errores.push('telefono debe tener entre 7 y 10 dígitos');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.fecha_registro || ''))) errores.push('fecha_registro debe tener formato AAAA-MM-DD');
    if (d.estado !== undefined && !['activo','inactivo'].includes(d.estado)) errores.push('estado debe ser uno de: ' + ['activo','inactivo'].join(', '));
    if (!Number.isInteger(Number(d.id_plan)) || Number(d.id_plan) <= 0) errores.push('id_plan debe ser un número entero mayor a 0');
    return errores;
};

// Verifica que el id de la URL sea un entero positivo.
const idValido = (valor) => Number.isInteger(Number(valor)) && Number(valor) > 0;

// GET /api/miembros
exports.getMiembros = (req, res, next) => {
    Miembro.getAll((err, rows) => {
        if (err) return next(err);
        res.status(200).json({ ok: true, total: rows.length, data: rows });
    });
};

// GET /api/miembros/:id
exports.getMiembroById = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Miembro.getById(req.params.id, (err, rows) => {
        if (err) return next(err);
        if (rows.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Miembro no encontrado' });
        }
        res.status(200).json({ ok: true, data: rows[0] });
    });
};

// POST /api/miembros
exports.postMiembro = (req, res, next) => {
    const d = req.body || {};
    if (d.estado === undefined) d.estado = 'activo';
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Miembro.create(d, (err, result) => {
        if (err) return next(err);
        res.status(201).json({
            ok: true,
            mensaje: 'Miembro creado correctamente',
            data: { id_miembro: result.insertId, ...d }
        });
    });
};

// PUT /api/miembros/:id  (reemplaza todos los campos del registro)
exports.putMiembro = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    const d = req.body || {};
    if (d.estado === undefined) d.estado = 'activo';
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Miembro.update(req.params.id, d, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Miembro no encontrado' });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Miembro actualizado correctamente',
            data: { id_miembro: Number(req.params.id), ...d }
        });
    });
};

// DELETE /api/miembros/:id
exports.deleteMiembro = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Miembro.remove(req.params.id, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Miembro no encontrado' });
        }
        res.status(200).json({ ok: true, mensaje: 'Miembro eliminado correctamente' });
    });
};
