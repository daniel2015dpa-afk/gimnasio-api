const db = require('../config/dbConfig');

const Plan = {
    getAll: (callback) => {
        db.query("SELECT p.* FROM planes p ORDER BY p.id_plan", callback);
    },

    getById: (id, callback) => {
        db.query("SELECT p.* FROM planes p WHERE p.id_plan = ?", [id], callback);
    },

    create: (d, callback) => {
        db.query(
            'INSERT INTO planes (nombre, descripcion, duracion_dias, precio) VALUES (?, ?, ?, ?)',
            [d.nombre, d.descripcion, d.duracion_dias, d.precio],
            callback
        );
    },

    update: (id, d, callback) => {
        db.query(
            'UPDATE planes SET nombre = ?, descripcion = ?, duracion_dias = ?, precio = ? WHERE id_plan = ?',
            [d.nombre, d.descripcion, d.duracion_dias, d.precio, id],
            callback
        );
    },

    remove: (id, callback) => {
        db.query('DELETE FROM planes WHERE id_plan = ?', [id], callback);
    }
};

module.exports = Plan;
