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

// Junta las filas del JOIN (una por miembro y clase) en un objeto por miembro con su lista de clases.
const agruparPorMiembro = (filas) => {
    const miembros = new Map();
    filas.forEach((f) => {
        if (!miembros.has(f.id_miembro)) {
            miembros.set(f.id_miembro, {
                id_miembro: f.id_miembro,
                documento: f.documento,
                nombre: f.nombre,
                apellido: f.apellido,
                correo: f.correo,
                telefono: f.telefono,
                fecha_registro: f.fecha_registro,
                estado: f.estado,
                plan: {
                    nombre: f.plan,
                    descripcion: f.plan_descripcion,
                    duracion_dias: f.duracion_dias,
                    precio: f.precio
                },
                clases: []
            });
        }
        miembros.get(f.id_miembro).clases.push({
            clase: f.clase,
            dia_semana: f.dia_semana,
            hora_inicio: f.hora_inicio,
            entrenador: f.entrenador,
            especialidad: f.especialidad,
            fecha_inscripcion: f.fecha_inscripcion
        });
    });
    return Array.from(miembros.values());
};

// GET /api/miembros/detalle  (opcional: ?nombre=juan)
exports.getMiembrosDetalle = (req, res, next) => {
    const nombre = req.query.nombre ? String(req.query.nombre).trim() : '';
    Miembro.getDetalle(nombre, (err, filas) => {
        if (err) return next(err);
        const data = agruparPorMiembro(filas);
        res.status(200).json({ ok: true, total: data.length, data });
    });
};
