const db = require('../config/dbConfig');

const Clase = {
    getAll: (callback) => {
        db.query("SELECT c.*, CONCAT(e.nombre, ' ', e.apellido) AS entrenador FROM clases c JOIN entrenadores e ON e.id_entrenador = c.id_entrenador ORDER BY c.id_clase", callback);
    },

    getById: (id, callback) => {
        db.query("SELECT c.*, CONCAT(e.nombre, ' ', e.apellido) AS entrenador FROM clases c JOIN entrenadores e ON e.id_entrenador = c.id_entrenador WHERE c.id_clase = ?", [id], callback);
    },

    create: (d, callback) => {
        db.query(
            'INSERT INTO clases (nombre, dia_semana, hora_inicio, cupo_max, id_entrenador) VALUES (?, ?, ?, ?, ?)',
            [d.nombre, d.dia_semana, d.hora_inicio, d.cupo_max, d.id_entrenador],
            callback
        );
    },

    update: (id, d, callback) => {
        db.query(
            'UPDATE clases SET nombre = ?, dia_semana = ?, hora_inicio = ?, cupo_max = ?, id_entrenador = ? WHERE id_clase = ?',
            [d.nombre, d.dia_semana, d.hora_inicio, d.cupo_max, d.id_entrenador, id],
            callback
        );
    },

    remove: (id, callback) => {
        db.query('DELETE FROM clases WHERE id_clase = ?', [id], callback);
    }
};

module.exports = Clase;
