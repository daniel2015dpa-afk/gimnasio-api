const db = require('../config/dbConfig');

const Inscripcion = {
    getAll: (callback) => {
        db.query("SELECT i.*, CONCAT(m.nombre, ' ', m.apellido) AS miembro, c.nombre AS clase FROM inscripciones i JOIN miembros m ON m.id_miembro = i.id_miembro JOIN clases c ON c.id_clase = i.id_clase ORDER BY i.id_inscripcion", callback);
    },

    getById: (id, callback) => {
        db.query("SELECT i.*, CONCAT(m.nombre, ' ', m.apellido) AS miembro, c.nombre AS clase FROM inscripciones i JOIN miembros m ON m.id_miembro = i.id_miembro JOIN clases c ON c.id_clase = i.id_clase WHERE i.id_inscripcion = ?", [id], callback);
    },

    create: (d, callback) => {
        db.query(
            'INSERT INTO inscripciones (id_miembro, id_clase, fecha_inscripcion) VALUES (?, ?, ?)',
            [d.id_miembro, d.id_clase, d.fecha_inscripcion],
            callback
        );
    },

    update: (id, d, callback) => {
        db.query(
            'UPDATE inscripciones SET id_miembro = ?, id_clase = ?, fecha_inscripcion = ? WHERE id_inscripcion = ?',
            [d.id_miembro, d.id_clase, d.fecha_inscripcion, id],
            callback
        );
    },

    remove: (id, callback) => {
        db.query('DELETE FROM inscripciones WHERE id_inscripcion = ?', [id], callback);
    }
};

module.exports = Inscripcion;
