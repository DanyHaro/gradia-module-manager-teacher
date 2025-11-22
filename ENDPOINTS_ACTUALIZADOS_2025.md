# 📚 ENDPOINTS BACKEND DOCENTE - ACTUALIZADO 2025

## 🎯 Información General

| Información | Detalle |
|-------------|---------|
| **Estado** | ✅ 100% Funcional con Seguridad JWT |
| **Total de Endpoints** | **57 endpoints operativos** |
| **Base de Datos** | PostgreSQL en Render.com (gradia_database_2025) |
| **Stack** | Node.js + Express.js + Sequelize |
| **Puerto** | 3002 |
| **Base URL** | `http://localhost:3002/api` |
| **Autenticación** | ✅ JWT (HS256) - Header: `Authorization: Bearer <token>` |
| **Control de Acceso** | ✅ Basado en Inscripciones (tabla `cursos.inscripcion`) |
| **Última Actualización** | 2025-01-21 |

---

## 📊 RESUMEN DE ENDPOINTS POR MÓDULO

| # | Módulo | Endpoints | URL Base | Auth |
|---|--------|-----------|----------|------|
| 1 | [Cursos](#1️⃣-cursos) | 2 | `/api/cursos` | ✅ JWT |
| 2 | [Unidades](#2️⃣-unidades) | 6 | `/api/unidades` | ✅ JWT |
| 3 | [Actividades](#3️⃣-actividades) | 6 | `/api/actividades` | ✅ JWT |
| 4 | [Entregas](#4️⃣-entregas) | 8 | `/api/entregas` | ✅ JWT |
| 5 | [Rúbricas](#5️⃣-rúbricas) | 6 | `/api/rubricas` | ✅ JWT |
| 6 | [Criterios](#6️⃣-criterios) | 6 | `/api/criterios` | ✅ JWT |
| 7 | [Evaluaciones](#7️⃣-evaluaciones) | 7 | `/api/evaluaciones` | ✅ JWT |
| 8 | [Grupos](#8️⃣-grupos) | 8 | `/api/grupos` | ✅ JWT |
| 9 | [Comentarios](#9️⃣-comentarios) | 5 | `/api/comentarios` | ✅ JWT |
| 10 | [Materiales](#🔟-materiales) | 6 | `/api/materiales` | ✅ JWT |

**TOTAL: 57 endpoints + 3 utilidad = 60 endpoints**

---

## 1️⃣ CURSOS

**Total: 2 endpoints (Solo lectura)**

⚠️ **IMPORTANTE:** Los cursos NO se pueden crear, editar ni eliminar desde la API. Los cursos son creados manualmente en la BD por el ADMIN.

| Método | Endpoint | Descripción | Control de Acceso |
|--------|----------|-------------|-------------------|
| `GET` | `/api/cursos` | Listar todos los cursos donde el docente está inscrito | ✅ Solo cursos inscritos |
| `GET` | `/api/cursos/:id` | Obtener curso específico por ID | ✅ Solo si está inscrito |

**Archivo:** `src/routes/cursoRoutes.js`

---

## 2️⃣ UNIDADES

**Total: 6 endpoints**

| Método | Endpoint | Descripción | Control de Acceso |
|--------|----------|-------------|-------------------|
| `GET` | `/api/unidades` | Listar todas las unidades | ✅ JWT |
| `GET` | `/api/unidades/curso/:cursoId` | Obtener todas las unidades de un curso | ✅ JWT |
| `GET` | `/api/unidades/:id` | Obtener unidad específica por ID | ✅ JWT |
| `POST` | `/api/unidades` | Crear nueva unidad | ✅ JWT + Inscripción validada |
| `PUT` | `/api/unidades/:id` | Actualizar unidad existente | ✅ JWT |
| `DELETE` | `/api/unidades/:id` | Eliminar unidad (sin actividades asociadas) | ✅ JWT |

**Archivo:** `src/routes/unidadRoutes.js`

**Campos principales:** `titulo_unidad`, `descripcion_unidad`, `numero_unidad`, `id_curso`

---

## 3️⃣ ACTIVIDADES

**Total: 6 endpoints**

| Método | Endpoint | Descripción | Control de Acceso |
|--------|----------|-------------|-------------------|
| `GET` | `/api/actividades` | Listar todas las actividades | ✅ JWT |
| `GET` | `/api/actividades/unidad/:unidadId` | Obtener todas las actividades de una unidad | ✅ JWT |
| `GET` | `/api/actividades/:id` | Obtener actividad específica por ID | ✅ JWT |
| `POST` | `/api/actividades` | Crear nueva actividad (tarea) | ✅ JWT + Inscripción validada |
| `PUT` | `/api/actividades/:id` | Actualizar actividad existente | ✅ JWT |
| `DELETE` | `/api/actividades/:id` | Eliminar actividad (sin entregas asociadas) | ✅ JWT |

**Archivo:** `src/routes/actividadRoutes.js`

**Campos principales:** `nombre_actividad`, `descripcion`, `fecha_limite`, `tipo_actividad`, `id_unidad`, `puntaje_maximo`, `es_grupal`

---

## 4️⃣ ENTREGAS

**Total: 8 endpoints (Vista docente para supervisión)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/entregas` | Listar todas las entregas con información completa |
| `GET` | `/api/entregas/actividad/:actividadId` | Obtener todas las entregas de una actividad |
| `GET` | `/api/entregas/curso/:cursoId` | Obtener todas las entregas de un curso |
| `GET` | `/api/entregas/usuario/:usuarioId` | Obtener todas las entregas de un estudiante |
| `GET` | `/api/entregas/estadisticas` | Estadísticas de entregas (dashboard) |
| `GET` | `/api/entregas/:id` | Obtener entrega específica por ID |
| `DELETE` | `/api/entregas/:id` | Eliminar entrega completa (Solo DOCENTE/ADMIN) |
| `DELETE` | `/api/entregas/:entregaId/archivo/:archivoId` | Eliminar archivo específico de entrega (Solo DOCENTE/ADMIN) |

**Archivo:** `src/routes/entregaRoutes.js`

**Nota:** Los estudiantes crean entregas desde su propio backend (`gradia-module-manager-student`)

---

## 5️⃣ RÚBRICAS

**Total: 6 endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/rubricas` | Listar todas las rúbricas |
| `GET` | `/api/rubricas/:id` | Obtener rúbrica con criterios y niveles |
| `POST` | `/api/rubricas` | Crear nueva rúbrica |
| `POST` | `/api/rubricas/:id/duplicate` | Duplicar rúbrica existente |
| `PUT` | `/api/rubricas/:id` | Actualizar rúbrica |
| `DELETE` | `/api/rubricas/:id` | Eliminar rúbrica |

**Archivo:** `src/routes/rubricaRoutes.js`

**Campos principales:** `nombre_rubrica`, `descripcion`, `id_usuario`

---

## 6️⃣ CRITERIOS

**Total: 6 endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/criterios` | Listar todos los criterios |
| `GET` | `/api/criterios/search` | Buscar criterios por nombre o descripción |
| `GET` | `/api/criterios/:id` | Obtener criterio específico |
| `POST` | `/api/criterios` | Crear nuevo criterio |
| `PUT` | `/api/criterios/:id` | Actualizar criterio |
| `DELETE` | `/api/criterios/:id` | Eliminar criterio |

**Archivo:** `src/routes/criterioRoutes.js`

**Campos principales:** `nombre_criterio`, `descripcion`, `id_usuario`

---

## 7️⃣ EVALUACIONES

**Total: 7 endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/evaluaciones` | Listar todas las evaluaciones |
| `GET` | `/api/evaluaciones/entrega/:entregaId` | Obtener evaluaciones de una entrega |
| `GET` | `/api/evaluaciones/estadisticas` | Estadísticas de evaluaciones |
| `GET` | `/api/evaluaciones/:id` | Obtener evaluación completa con detalles |
| `POST` | `/api/evaluaciones` | Crear evaluación completa con detalles por criterio |
| `PUT` | `/api/evaluaciones/:id` | Actualizar evaluación |
| `DELETE` | `/api/evaluaciones/:id` | Eliminar evaluación |

**Archivo:** `src/routes/evaluacionRoutes.js`

**Campos principales:** `id_entrega`, `id_usuario`, `puntuacion_total`, `comentarios`, `detalles[]`

---

## 8️⃣ GRUPOS

**Total: 8 endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/grupos` | Listar todos los grupos con sus miembros |
| `GET` | `/api/grupos/actividad/:actividadId` | Obtener todos los grupos de una actividad |
| `GET` | `/api/grupos/:id` | Obtener grupo específico por ID |
| `POST` | `/api/grupos` | Crear nuevo grupo (solo para actividades grupales) |
| `PUT` | `/api/grupos/:id` | Actualizar nombre del grupo |
| `DELETE` | `/api/grupos/:id` | Eliminar grupo (sin entregas asociadas) |
| `POST` | `/api/grupos/:id/miembros` | Agregar estudiante al grupo |
| `DELETE` | `/api/grupos/:id/miembros/:miembroId` | Quitar estudiante del grupo |

**Archivo:** `src/routes/grupoRoutes.js`

**Campos principales:** `nombre_grupo`, `id_actividad`

**Restricción:** Solo se pueden crear grupos para actividades con `es_grupal = true`

---

## 9️⃣ COMENTARIOS

**Total: 5 endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/comentarios/entrega/:entregaId` | Obtener todos los comentarios de una entrega |
| `GET` | `/api/comentarios/:id` | Obtener comentario específico |
| `POST` | `/api/comentarios` | Crear comentario en una entrega (Feedback) |
| `PUT` | `/api/comentarios/:id` | Actualizar comentario (solo autor) |
| `DELETE` | `/api/comentarios/:id` | Eliminar comentario (solo autor) |

**Archivo:** `src/routes/comentarioRoutes.js`

**Campos principales:** `id_entrega`, `id_usuario`, `contenido`, `fecha_comentario`

---

## 🔟 MATERIALES

**Total: 6 endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/materiales` | Listar todos los materiales |
| `GET` | `/api/materiales/actividad/:actividadId` | Obtener todos los materiales de una actividad |
| `GET` | `/api/materiales/:id` | Obtener material específico |
| `POST` | `/api/materiales` | Subir material a una actividad |
| `PUT` | `/api/materiales/:id` | Actualizar material |
| `DELETE` | `/api/materiales/:id` | Eliminar material |

**Archivo:** `src/routes/materialRoutes.js`

**Campos principales:** `id_actividad`, `nombre_documento`, `tipo_documento`, `url_archivo`

**Tipos soportados:** `pdf`, `video`, `ppt`, `doc`, `docx`, `link`

---

## 🚀 ENDPOINTS DE UTILIDAD

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Información general de la API y módulos |
| `GET` | `/api/health` | Verificar estado del servidor y conexión a BD |
| `GET` | `/api/resumen` | Resumen completo del proyecto implementado |

**Archivo:** `app.js`

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

### ✅ Flujo de Autenticación:

1. **Login** → Backend de Autenticación (`http://localhost:8080/api/auth/login`) genera JWT
2. **Cada Request** → Frontend envía JWT en header: `Authorization: Bearer <token>`
3. **Middleware `authenticate`** → Valida JWT y extrae usuario (`req.user.id`, `req.user.email`)
4. **Controller** → Ejecuta lógica de negocio

### 🔒 Características de Seguridad:

- ✅ **JWT HS256** con secret compartido: `elgradia2025$`
- ✅ **Validación de inscripciones** antes de crear unidades/actividades
- ✅ **Control de acceso basado en roles** (RBAC)
- ✅ **Autorización por endpoint** (algunos requieren rol DOCENTE/ADMIN)

---

## 📐 JERARQUÍA DEL SISTEMA

```
📚 CURSO (creado manualmente en BD por ADMIN)
   └── 📖 UNIDAD (creada por docente inscrito)
        └── 📝 ACTIVIDAD (creada por docente inscrito)
             ├── 📎 MATERIALES (documentos de apoyo)
             │    └── PDF, Videos, PPT, Links
             │
             ├── 👥 GRUPOS (solo si es_grupal = true)
             │    └── 👤 MIEMBROS
             │
             └── 📤 ENTREGAS (creadas por estudiantes)
                  ├── 📁 ARCHIVOS ADJUNTOS
                  ├── 💬 COMENTARIOS (feedback docente)
                  └── ⭐ EVALUACIONES
                       ├── 📊 RÚBRICA
                       │    └── CRITERIOS + NIVELES
                       └── 📋 DETALLES (por criterio)
```

---

## 📊 ESTADÍSTICAS DEL PROYECTO

| Métrica | Cantidad |
|---------|----------|
| **Endpoints Totales** | 60 |
| **Endpoints CRUD** | 57 |
| **Endpoints Utilidad** | 3 |
| **Archivos de Rutas** | 10 |
| **Modelos Sequelize** | 16 |
| **Controllers** | 10 |

---

## ⚠️ NOTAS IMPORTANTES

1. **Cursos:**
   - ❌ NO se pueden crear, editar ni eliminar vía API
   - ✅ Los cursos se crean manualmente en la BD por el ADMIN
   - ✅ Los docentes solo pueden VER cursos donde están inscritos

2. **Inscripciones:**
   - La tabla `cursos.inscripcion` controla el acceso
   - Relación N:M entre `usuarios` y `cursos`
   - Se valida automáticamente en operaciones críticas

3. **Entregas:**
   - Los docentes NO crean entregas (solo las supervisan)
   - Las entregas son creadas por estudiantes desde su backend

4. **Base de Datos:**
   - Compartida entre todos los backends
   - Host: `dpg-d4f53bili9vc739cgsng-a.oregon-postgres.render.com`
   - Database: `gradia_database_2025`

---

**Última actualización:** 2025-01-21
**Versión:** 2.0
**Stack:** Node.js v20+ + Express.js v4.21 + Sequelize v6.37 + PostgreSQL
