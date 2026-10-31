const db = require('../config/dbConfig');

const Entrenador = {
    getAll: (callback) => {
        db.query("SELECT e.* FROM entrenadores e ORDER BY e.id_entrenador", callback);
    },

    getById: (id, callback) => {
        db.query("SELECT e.* FROM entrenadores e WHERE e.id_entrenador = ?", [id], callback);
    },

    create: (d, callback) => {
        db.query(
            'INSERT INTO entrenadores (documento, nombre, apellido, especialidad, correo, telefono) VALUES (?, ?, ?, ?, ?, ?)',
            [d.documento, d.nombre, d.apellido, d.especialidad, d.correo, d.telefono],
            callback
        );
    },

    update: (id, d, callback) => {
        db.query(
            'UPDATE entrenadores SET documento = ?, nombre = ?, apellido = ?, especialidad = ?, correo = ?, telefono = ? WHERE id_entrenador = ?',
            [d.documento, d.nombre, d.apellido, d.especialidad, d.correo, d.telefono, id],
            callback
        );
    },

    remove: (id, callback) => {
        db.query('DELETE FROM entrenadores WHERE id_entrenador = ?', [id], callback);
    }
};

module.exports = Entrenador;
