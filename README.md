# 👨‍🏫 GradIA - Backend Teacher (Vista de Docente)

Backend para la gestión de cursos, unidades, actividades, evaluaciones y materiales desde la perspectiva del profesor.

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js v16+ instalado
- PostgreSQL (o acceso a la BD en Render)
- Git

### Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd gradia-module-manager-teacher

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver sección siguiente)
cp .env.example .env
# Editar .env con tus credenciales

# 4. Iniciar el servidor
npm start
```

El servidor estará disponible en: `http://localhost:3000`

---

## ⚙️ Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

### 🏠 Configuración LOCAL (Desarrollo)

Usa esta configuración cuando estés desarrollando en tu computadora:

```env
# Puerto del servidor
PORT=3000

# JWT Secret (DEBE SER EL MISMO que en auth_gradia)
JWT_SECRET=elgradia2025$

# URL del servicio de autenticación (LOCAL)
AUTH_SERVICE_URL=http://localhost:8080

# URL del frontend (LOCAL)
FRONTEND_URL=http://localhost:3000

# Base de datos PostgreSQL
DB_HOST=dpg-d3r732u3jp1c7393ltdg-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=grad_ia_bd
DB_USER=gradia_user
DB_PASSWORD=wA1ULtUE7BzIQBD8vL3OL9j1lxXcs0er

# Ambiente
NODE_ENV=development
```

### ☁️ Configuración PRODUCCIÓN (Render/Deploy)

Usa esta configuración cuando despliegues en Render u otro servicio:

```env
# Puerto (Render lo asigna automáticamente)
PORT=3000

# JWT Secret (DEBE SER EL MISMO que en auth_gradia)
JWT_SECRET=elgradia2025$

# URL del servicio de autenticación (PRODUCCIÓN)
AUTH_SERVICE_URL=https://auth-gradia.onrender.com

# URL del frontend (PRODUCCIÓN)
FRONTEND_URL=https://gradia-frontend.vercel.app

# Base de datos PostgreSQL (misma BD compartida)
DB_HOST=dpg-d3r732u3jp1c7393ltdg-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=grad_ia_bd
DB_USER=gradia_user
DB_PASSWORD=wA1ULtUE7BzIQBD8vL3OL9j1lxXcs0er

# Ambiente
NODE_ENV=production
```

---

## 🔑 Autenticación JWT

Este backend **requiere autenticación JWT** en todas las rutas.

### Cómo funciona:

1. El usuario hace login en `auth_gradia` (puerto 8080)
2. Recibe un `accessToken` JWT
3. El frontend incluye el token en cada request:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Este backend valida el token y verifica que el usuario tenga rol `DOCENTE` o `ADMIN`

### ⚠️ IMPORTANTE:

El `JWT_SECRET` debe ser **exactamente el mismo** en:
- `auth_gradia/.env`
- `gradia-module-manager-teacher/.env`
- `gradia-module-manager-student/.env`

Si no coinciden, los tokens no se podrán validar.

---

## 📡 Endpoints Disponibles

Todos los endpoints requieren:
- Header: `Authorization: Bearer <token>`
- Rol: `DOCENTE` o `ADMIN`

### Cursos (19 endpoints)

```
GET    /api/cursos                      - Obtener todos los cursos del docente
GET    /api/cursos/:id                  - Obtener detalle de un curso
POST   /api/cursos                      - Crear nuevo curso
PUT    /api/cursos/:id                  - Actualizar curso
DELETE /api/cursos/:id                  - Eliminar curso (solo DOCENTE/ADMIN)
GET    /api/cursos/:id/unidades         - Obtener unidades de un curso
GET    /api/cursos/:id/actividades      - Obtener actividades de un curso
GET    /api/cursos/:id/estudiantes      - Obtener estudiantes inscritos
...
```

### Unidades

```
GET    /api/unidades                    - Obtener todas las unidades
GET    /api/unidades/:id                - Obtener detalle de una unidad
POST   /api/unidades                    - Crear nueva unidad
PUT    /api/unidades/:id                - Actualizar unidad
DELETE /api/unidades/:id                - Eliminar unidad (solo DOCENTE/ADMIN)
GET    /api/unidades/:id/actividades    - Obtener actividades de una unidad
```

### Actividades

```
GET    /api/actividades                 - Obtener todas las actividades
GET    /api/actividades/:id             - Obtener detalle de una actividad
POST   /api/actividades                 - Crear nueva actividad
PUT    /api/actividades/:id             - Actualizar actividad
DELETE /api/actividades/:id             - Eliminar actividad (solo DOCENTE/ADMIN)
GET    /api/actividades/:id/entregas    - Obtener entregas de una actividad
```

### Entregas (8 endpoints)

```
GET    /api/entregas                    - Obtener todas las entregas
GET    /api/entregas/:id                - Obtener detalle de una entrega
POST   /api/entregas                    - Crear entrega
PUT    /api/entregas/:id                - Actualizar entrega
DELETE /api/entregas/:id                - Eliminar entrega (solo DOCENTE/ADMIN)
GET    /api/entregas/:id/archivos       - Obtener archivos de una entrega
POST   /api/entregas/:id/archivos       - Subir archivo a una entrega
DELETE /api/entregas/:entregaId/archivo/:archivoId - Eliminar archivo (solo DOCENTE/ADMIN)
```

### Evaluaciones (16 endpoints)

```
GET    /api/evaluaciones                - Obtener todas las evaluaciones
GET    /api/evaluaciones/:id            - Obtener detalle de una evaluación
POST   /api/evaluaciones                - Crear evaluación
PUT    /api/evaluaciones/:id            - Actualizar evaluación
DELETE /api/evaluaciones/:id            - Eliminar evaluación
GET    /api/evaluaciones/:id/criterios  - Obtener criterios de evaluación
POST   /api/evaluaciones/:id/criterios  - Crear criterio
...
```

### Grupos (8 endpoints)

```
GET    /api/grupos                      - Obtener todos los grupos
GET    /api/grupos/:id                  - Obtener detalle de un grupo
POST   /api/grupos                      - Crear grupo
PUT    /api/grupos/:id                  - Actualizar grupo
DELETE /api/grupos/:id                  - Eliminar grupo
GET    /api/grupos/:id/miembros         - Obtener miembros de un grupo
POST   /api/grupos/:id/miembros         - Agregar miembro a un grupo
DELETE /api/grupos/:id/miembros/:usuarioId - Eliminar miembro de un grupo
```

### Comentarios (5 endpoints)

```
GET    /api/comentarios                 - Obtener comentarios
GET    /api/comentarios/:id             - Obtener detalle de un comentario
POST   /api/comentarios                 - Crear comentario
PUT    /api/comentarios/:id             - Actualizar comentario
DELETE /api/comentarios/:id             - Eliminar comentario
```

### Materiales (6 endpoints)

```
GET    /api/materiales                  - Obtener materiales
GET    /api/materiales/:id              - Obtener detalle de un material
POST   /api/materiales                  - Crear material
PUT    /api/materiales/:id              - Actualizar material
DELETE /api/materiales/:id              - Eliminar material
POST   /api/materiales/:id/descargar    - Registrar descarga
```

---

## 🧪 Pruebas con Postman

### 1. Login como DOCENTE (en auth_gradia)

```
POST http://localhost:8080/api/auth/login

Body (JSON):
{
  "email": "profesor@test.com",
  "password": "123456"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Crear un curso

```
POST http://localhost:3000/api/cursos

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Body (JSON):
{
  "nombre_curso": "Matemáticas I",
  "descripcion": "Curso introductorio de matemáticas",
  "codigo_curso": "MAT101"
}

Response:
{
  "success": true,
  "data": {
    "id_curso": 1,
    "nombre_curso": "Matemáticas I",
    ...
  }
}
```

### 3. Crear una unidad

```
POST http://localhost:3000/api/unidades

Headers:
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "id_curso": 1,
  "titulo_unidad": "Álgebra Básica",
  "descripcion": "...",
  "orden": 1
}
```

### 4. Crear una actividad

```
POST http://localhost:3000/api/actividades

Headers:
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "id_unidad": 1,
  "nombre_actividad": "Tarea 1",
  "descripcion": "Resolver ejercicios del 1 al 10",
  "fecha_limite": "2025-12-31",
  "tipo_actividad": "TAREA"
}
```

---

## 🏗️ Estructura del Proyecto

```
gradia-module-manager-teacher/
├── src/
│   ├── controllers/          # Lógica de negocio
│   │   ├── cursoController.js
│   │   ├── unidadController.js
│   │   ├── actividadController.js
│   │   ├── entregaController.js
│   │   ├── evaluacionController.js
│   │   ├── grupoController.js
│   │   ├── comentarioController.js
│   │   └── materialController.js
│   ├── routes/               # Definición de rutas
│   │   ├── cursoRoutes.js
│   │   ├── unidadRoutes.js
│   │   ├── actividadRoutes.js
│   │   ├── entregaRoutes.js
│   │   ├── evaluacionRoutes.js
│   │   ├── grupoRoutes.js
│   │   ├── comentarioRoutes.js
│   │   └── materialRoutes.js
│   ├── middlewares/          # Middlewares de autenticación
│   │   ├── authenticate.js   # ✅ Valida JWT
│   │   └── authorize.js      # ✅ Verifica roles
│   └── models/               # Modelos Sequelize
├── app.js                    # Configuración principal
├── package.json
├── .env                      # Variables de entorno (NO SUBIR A GIT)
├── .env.example              # Ejemplo de .env
└── README.md
```

---

## 🔧 Comandos Disponibles

```bash
# Iniciar servidor en desarrollo
npm start

# Iniciar con nodemon (recarga automática)
npm run dev

# Verificar sintaxis
npm run lint
```

---

## 🌐 Desplegar en Render

### Paso 1: Crear nuevo Web Service

1. Ve a [Render.com](https://render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub

### Paso 2: Configuración

```
Name: gradia-teacher-backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

### Paso 3: Variables de Entorno

Agrega las siguientes variables en Render:

```
PORT=3000
JWT_SECRET=elgradia2025$
AUTH_SERVICE_URL=https://auth-gradia.onrender.com
FRONTEND_URL=https://gradia-frontend.vercel.app
DB_HOST=dpg-d3r732u3jp1c7393ltdg-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=grad_ia_bd
DB_USER=gradia_user
DB_PASSWORD=wA1ULtUE7BzIQBD8vL3OL9j1lxXcs0er
NODE_ENV=production
```

### Paso 4: Deploy

Click en **"Create Web Service"** y espera a que se despliegue.

Tu backend estará disponible en: `https://gradia-teacher-backend.onrender.com`

---

## 🔒 Seguridad

### Roles Permitidos

Este backend **solo** permite acceso a usuarios con rol:
- `DOCENTE`
- `ADMIN`

Si un usuario con rol `ESTUDIANTE` intenta acceder, recibirá:

```json
{
  "success": false,
  "message": "Acceso denegado. Se requiere uno de los siguientes roles: DOCENTE, ADMIN"
}
```

### Permisos Especiales

Algunas rutas de **eliminación** requieren específicamente rol `DOCENTE` o `ADMIN`:
- `DELETE /api/cursos/:id`
- `DELETE /api/unidades/:id`
- `DELETE /api/actividades/:id`
- `DELETE /api/entregas/:id`
- `DELETE /api/entregas/:entregaId/archivo/:archivoId`

### Headers Requeridos

```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## ❓ Problemas Comunes

### Error: "NO AUTH TOKEN"

**Solución:** Asegúrate de incluir el header `Authorization: Bearer <token>`

### Error: "INVALID OR EXPIRED TOKEN"

**Soluciones:**
1. Verifica que `JWT_SECRET` sea igual en todos los backends
2. Haz login de nuevo para obtener un token fresco (expiran en 15 min)

### Error: "Acceso denegado"

**Solución:** Tu usuario debe tener rol `DOCENTE` o `ADMIN`. Verifica con:
```
GET http://localhost:8080/api/auth/me
```

### Error de CORS

**Solución:** Verifica que `FRONTEND_URL` en `.env` coincida con la URL de tu frontend

### Error: "Cannot read property 'id' of undefined"

**Solución:** El middleware `authenticate` no se está aplicando correctamente. Verifica que las rutas estén protegidas en `app.js` o en los archivos de rutas.

---

## 📚 Recursos

- [Documentación de Auth Backend](../auth_gradia/README.md)
- [Documentación de Student Backend](../gradia-module-manager-student/README.md)
- [Guía de Integración JWT](../INTEGRACION_AUTH.md)
- [Script para crear usuarios DOCENTE](../CREAR_DOCENTE.sql)

---

## 👥 Equipo

- **Desarrollado por:** Equipo GradIA
- **Versión:** 1.0.0
- **Última actualización:** 2025-11-15

---

## 📝 Notas Importantes

1. **JWT_SECRET:** Debe ser el mismo en los 3 backends
2. **Base de Datos:** Todos los backends comparten la misma BD PostgreSQL
3. **Roles:** Este backend SOLO acepta usuarios con rol `DOCENTE` o `ADMIN`
4. **Tokens:** Expiran en 15 minutos, usa el refresh token para renovarlos
5. **CORS:** El frontend debe estar en `FRONTEND_URL` para evitar errores
6. **Creación de Cursos:** Solo usuarios con rol DOCENTE pueden crear contenido educativo

---

## 🎯 Flujo de Trabajo Típico

### Para un DOCENTE:

1. Login → Recibe JWT con rol `DOCENTE`
2. Crear curso → `POST /api/cursos`
3. Crear unidades → `POST /api/unidades`
4. Crear actividades → `POST /api/actividades`
5. Ver entregas de estudiantes → `GET /api/entregas`
6. Evaluar entregas → `POST /api/evaluaciones`
7. Comentar sobre entregas → `POST /api/comentarios`

### ¿Cómo se crea un usuario DOCENTE?

Los usuarios DOCENTE **NO** se pueden auto-registrar. Solo hay 3 formas:

1. **Manualmente en la BD:** Usa el script [CREAR_DOCENTE.sql](../CREAR_DOCENTE.sql)
2. **Vía Admin:** Un usuario ADMIN usa `POST /api/auth/admin/users` (en auth_gradia)
3. **Actualización de rol:** Un ADMIN actualiza un usuario ESTUDIANTE existente

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa esta documentación
2. Verifica las variables de entorno
3. Consulta los logs del servidor
4. Revisa la [Guía de Integración](../INTEGRACION_AUTH.md)
5. Verifica que tengas un usuario con rol DOCENTE creado

---

## 🔗 URLs de Referencia

### Desarrollo Local:
- Auth Backend: `http://localhost:8080`
- Teacher Backend: `http://localhost:3000`
- Student Backend: `http://localhost:3001`

### Producción (Render):
- Auth Backend: `https://auth-gradia.onrender.com`
- Teacher Backend: `https://gradia-teacher-backend.onrender.com` (ajustar cuando se despliegue)
- Student Backend: `https://gradia-student-backend.onrender.com` (ajustar cuando se despliegue)
