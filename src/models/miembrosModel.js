const db = require('../config/dbConfig');

const Miembro = {
    getAll: (callback) => {
        db.query("SELECT m.*, p.nombre AS plan FROM miembros m JOIN planes p ON p.id_plan = m.id_plan ORDER BY m.id_miembro", callback);
    },

    getById: (id, callback) => {
        db.query("SELECT m.*, p.nombre AS plan FROM miembros m JOIN planes p ON p.id_plan = m.id_plan WHERE m.id_miembro = ?", [id], callback);
    },

    // Miembros con su plan, sus clases, el horario y el entrenador (INNER JOIN entre 5 tablas).
    // Si se envía un nombre, filtra por nombre o apellido.
    getDetalle: (nombre, callback) => {
        let sql = `
            SELECT m.id_miembro, m.documento, m.nombre, m.apellido, m.correo, m.telefono,
                   m.fecha_registro, m.estado,
                   p.nombre AS plan, p.descripcion AS plan_descripcion,
                   p.duracion_dias, p.precio,
                   c.nombre AS clase, c.dia_semana, c.hora_inicio,
                   CONCAT(e.nombre, ' ', e.apellido) AS entrenador, e.especialidad,
                   i.fecha_inscripcion
            FROM miembros m
            INNER JOIN planes p ON p.id_plan = m.id_plan
            INNER JOIN inscripciones i ON i.id_miembro = m.id_miembro
            INNER JOIN clases c ON c.id_clase = i.id_clase
            INNER JOIN entrenadores e ON e.id_entrenador = c.id_entrenador`;
        const params = [];
        if (nombre) {
            sql += ` WHERE CONCAT(m.nombre, ' ', m.apellido) LIKE ?`;
            params.push(`%${nombre}%`);
        }
        sql += ` ORDER BY m.id_miembro,
                 FIELD(c.dia_semana, 'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'),
                 c.hora_inicio`;
        db.query(sql, params, callback);
    },

    create: (d, callback) => {
        db.query(
            'INSERT INTO miembros (documento, nombre, apellido, correo, telefono, fecha_registro, estado, id_plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [d.documento, d.nombre, d.apellido, d.correo, d.telefono, d.fecha_registro, d.estado, d.id_plan],
            callback
        );
    },

    update: (id, d, callback) => {
        db.query(
            'UPDATE miembros SET documento = ?, nombre = ?, apellido = ?, correo = ?, telefono = ?, fecha_registro = ?, estado = ?, id_plan = ? WHERE id_miembro = ?',
            [d.documento, d.nombre, d.apellido, d.correo, d.telefono, d.fecha_registro, d.estado, d.id_plan, id],
            callback
        );
    },

    remove: (id, callback) => {
        db.query('DELETE FROM miembros WHERE id_miembro = ?', [id], callback);
    }
};

module.exports = Miembro;
