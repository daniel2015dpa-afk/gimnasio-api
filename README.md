# API REST del gimnasio

API construida con Node.js, Express y MySQL (mysql2). Gestiona planes, entrenadores, miembros, clases e inscripciones de un gimnasio. Sigue la estructura modelo → controlador → ruta.

## Estructura

```
src/
  config/dbConfig.js        conexión a MySQL (lee variables de entorno)
  models/                   consultas SQL de cada tabla
  controllers/              validación de datos y respuestas JSON
  routes/                   endpoints de cada tabla
  index.js                  arranque del servidor y manejo de errores
```

## Instalación

1. Clona el repositorio e ingresa a la carpeta.
2. Instala dependencias: `npm install`
3. Copia `.env.example` como `.env` y completa los datos de tu base de datos.
4. Ejecuta: `npm start` (o `npm run dev` para reiniciar con cada cambio).
5. Abre `http://localhost:3000/` y verás un mensaje de que la API funciona.

## Variables de entorno

| Variable | Descripción |
|---|---|
| DB_HOST | Host de la base de datos |
| DB_PORT | Puerto (3306 por defecto) |
| DB_USER | Usuario |
| DB_PASSWORD | Contraseña |
| DB_NAME | Nombre de la base de datos |
| PORT | Puerto del servidor (lo asigna Render automáticamente) |

El archivo `.env` no se sube al repositorio.

## Endpoints

Cada recurso tiene los mismos cinco endpoints. Reemplaza `{recurso}` por: `planes`, `entrenadores`, `miembros`, `clases` o `inscripciones`.

| Método | Ruta | Descripción | Códigos |
|---|---|---|---|
| GET | /api/{recurso} | Lista todos los registros | 200 |
| GET | /api/{recurso}/:id | Obtiene un registro | 200, 400, 404 |
| POST | /api/{recurso} | Crea un registro | 201, 400, 409 |
| PUT | /api/{recurso}/:id | Reemplaza un registro | 200, 400, 404, 409 |
| DELETE | /api/{recurso}/:id | Elimina un registro | 200, 400, 404, 409 |

### Cuerpos (JSON) para POST y PUT

- **planes:** `{ "nombre": "Mensual Plus", "descripcion": "Sala y clases", "duracion_dias": 30, "precio": 95000 }`
- **entrenadores:** `{ "documento": "1047100011", "nombre": "Luis", "apellido": "Gil", "especialidad": "Natación", "correo": "luis.gil@gymfit.com", "telefono": "3001000011" }`
- **miembros:** `{ "documento": "1001234513", "nombre": "Paula", "apellido": "León", "correo": "paula.leon@correo.com", "telefono": "3213456789", "fecha_registro": "2026-10-30", "estado": "activo", "id_plan": 1 }` (estado es opcional)
- **clases:** `{ "nombre": "Yoga Vespertino", "dia_semana": "Jueves", "hora_inicio": "18:00:00", "cupo_max": 20, "id_entrenador": 2 }`
- **inscripciones:** `{ "id_miembro": 1, "id_clase": 3, "fecha_inscripcion": "2026-10-30" }`

### Formato de las respuestas

```json
{ "ok": true, "total": 10, "data": [ ... ] }
{ "ok": true, "mensaje": "Miembro creado correctamente", "data": { ... } }
{ "ok": false, "mensaje": "Datos inválidos", "errores": [ "correo no es un correo válido" ] }
```

### Errores controlados

| Código | Cuándo ocurre |
|---|---|
| 400 | Datos inválidos, id mal formado, JSON inválido o llave foránea que no existe |
| 404 | El registro o la ruta no existe |
| 409 | Valor UNIQUE repetido o registro que no se puede eliminar porque está en uso |
| 500 | Error interno del servidor |

## Despliegue en Render

1. Sube el proyecto a GitHub (sin `.env` ni `node_modules`).
2. En Render crea un **Web Service** conectado al repositorio.
3. Build Command: `npm install` · Start Command: `npm start`.
4. En **Environment** agrega las variables DB_HOST, DB_PORT, DB_USER, DB_PASSWORD y DB_NAME con los datos de Clever Cloud.
5. Al terminar el despliegue, abre la URL pública y verifica que responda.
