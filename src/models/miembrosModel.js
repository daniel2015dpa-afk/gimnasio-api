const db = require('../config/dbConfig');

const Miembro = {
    getAll: (callback) => {
        db.query("SELECT m.*, p.nombre AS plan FROM miembros m JOIN planes p ON p.id_plan = m.id_plan ORDER BY m.id_miembro", callback);
    },

    getById: (id, callback) => {
        db.query("SELECT m.*, p.nombre AS plan FROM miembros m JOIN planes p ON p.id_plan = m.id_plan WHERE m.id_miembro = ?", [id], callback);
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
