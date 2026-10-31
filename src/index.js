require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta raíz: sirve para comprobar que la API está viva
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: 'API del gimnasio funcionando',
        endpoints: ['/api/planes', '/api/entrenadores', '/api/miembros', '/api/clases', '/api/inscripciones']
    });
});

// Rutas de cada tabla
app.use('/api/planes', require('./routes/planesRoutes'));
app.use('/api/entrenadores', require('./routes/entrenadoresRoutes'));
app.use('/api/miembros', require('./routes/miembrosRoutes'));
app.use('/api/clases', require('./routes/clasesRoutes'));
app.use('/api/inscripciones', require('./routes/inscripcionesRoutes'));

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

// Manejo central de errores (los controladores llaman next(err))
app.use((err, req, res, next) => {
    // JSON mal formado en el body
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ ok: false, mensaje: 'El body no es un JSON válido' });
    }

    switch (err.code) {
        case 'ER_DUP_ENTRY': // viola un UNIQUE
            return res.status(409).json({
                ok: false,
                mensaje: 'Ya existe un registro con ese valor único (documento, correo, nombre o inscripción repetida)'
            });
        case 'ER_NO_REFERENCED_ROW_2': // FK que no existe
            return res.status(400).json({
                ok: false,
                mensaje: 'Una llave foránea apunta a un registro que no existe (plan, entrenador, miembro o clase)'
            });
        case 'ER_ROW_IS_REFERENCED_2': // se intenta borrar algo en uso
            return res.status(409).json({
                ok: false,
                mensaje: 'No se puede eliminar: el registro está siendo usado por otras tablas'
            });
        case 'ER_TRUNCATED_WRONG_VALUE': // fecha u hora imposible, ej. 2026-13-45
        case 'ER_WRONG_VALUE':
        case 'ER_BAD_NULL_ERROR':
            return res.status(400).json({ ok: false, mensaje: 'Algún dato tiene un valor no permitido' });
        default:
            console.error(err);
            return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    console.log(`Servidor corriendo en: ${url}`);
    console.log(`Endpoints: ${url}/api/miembros`);
});