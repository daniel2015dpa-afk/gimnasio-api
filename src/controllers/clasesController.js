const Clase = require('../models/clasesModel');

// Valida los datos que llegan en el body. Devuelve la lista de errores (vacía si todo está bien).
const validar = (d) => {
    const errores = [];
    if (!d.nombre || String(d.nombre).trim() === '') errores.push('nombre es obligatorio');
    if (!['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].includes(d.dia_semana)) errores.push('dia_semana debe ser uno de: ' + ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].join(', '));
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(String(d.hora_inicio || ''))) errores.push('hora_inicio debe tener formato HH:MM o HH:MM:SS');
    if (!Number.isInteger(Number(d.cupo_max)) || Number(d.cupo_max) <= 0) errores.push('cupo_max debe ser un número entero mayor a 0');
    if (!Number.isInteger(Number(d.id_entrenador)) || Number(d.id_entrenador) <= 0) errores.push('id_entrenador debe ser un número entero mayor a 0');
    return errores;
};

// Verifica que el id de la URL sea un entero positivo.
const idValido = (valor) => Number.isInteger(Number(valor)) && Number(valor) > 0;

// GET /api/clases
exports.getClases = (req, res, next) => {
    Clase.getAll((err, rows) => {
        if (err) return next(err);
        res.status(200).json({ ok: true, total: rows.length, data: rows });
    });
};

// GET /api/clases/:id
exports.getClaseById = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Clase.getById(req.params.id, (err, rows) => {
        if (err) return next(err);
        if (rows.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Clase no encontrada' });
        }
        res.status(200).json({ ok: true, data: rows[0] });
    });
};

// POST /api/clases
exports.postClase = (req, res, next) => {
    const d = req.body || {};
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Clase.create(d, (err, result) => {
        if (err) return next(err);
        res.status(201).json({
            ok: true,
            mensaje: 'Clase creada correctamente',
            data: { id_clase: result.insertId, ...d }
        });
    });
};

// PUT /api/clases/:id  (reemplaza todos los campos del registro)
exports.putClase = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    const d = req.body || {};
    const errores = validar(d);
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, mensaje: 'Datos inválidos', errores });
    }
    Clase.update(req.params.id, d, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Clase no encontrada' });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Clase actualizada correctamente',
            data: { id_clase: Number(req.params.id), ...d }
        });
    });
};

// DELETE /api/clases/:id
exports.deleteClase = (req, res, next) => {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero mayor a 0' });
    }
    Clase.remove(req.params.id, (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Clase no encontrada' });
        }
        res.status(200).json({ ok: true, mensaje: 'Clase eliminada correctamente' });
    });
};
