# 📚 DOCUMENTACIÓN API - GradIA Module Manager Teacher

## Información General
- **Versión**: 4.0.0
- **Base URL**: `http://localhost:3000`
- **Base de Datos**: PostgreSQL en Render.com
- **Total de Endpoints**: 62
- **Completitud**: 100% ✅

---

## 📊 MÓDULOS IMPLEMENTADOS

### 1. Gestión de Cursos (19 endpoints)
### 2. Gestión de Entregas (8 endpoints)
### 3. Sistema de Evaluación (16 endpoints)
### 4. Gestión de Grupos (8 endpoints)
### 5. Sistema de Comentarios (5 endpoints)
### 6. Gestión de Materiales (6 endpoints)

---

## 1️⃣ GESTIÓN DE CURSOS (19 endpoints)

### 📌 **CURSOS** - 5 endpoints

#### GET /api/cursos
Obtener todos los cursos con sus unidades

**Request:**
```bash
curl http://localhost:3000/api/cursos
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_curso": 1,
      "nombre_curso": "Sistemas Dinámicos Avanzados",
      "descripcion": "Curso actualizado de análisis de sistemas dinámicos",
      "estado": "activo",
      "id_usuario": 1,
      "created_at": "2025-09-18T06:10:19.167Z",
      "updated_at": "2025-09-18T06:16:06.913Z",
      "unidades": [
        {
          "id_unidad": 1,
          "titulo_unidad": "Unidad 1: Introducción",
          "numero_unidad": 1
        }
      ]
    }
  ],
  "message": "Cursos obtenidos exitosamente"
}
```

---

#### GET /api/cursos/:id
Obtener un curso específico por ID con todas sus unidades

**Request:**
```bash
curl http://localhost:3000/api/cursos/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id_curso": 1,
    "nombre_curso": "Sistemas Dinámicos Avanzados",
    "descripcion": "Curso actualizado...",
    "estado": "activo",
    "id_usuario": 1,
    "unidades": [...]
  },
  "message": "Curso obtenido exitosamente"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Curso no encontrado"
}
```

---

#### POST /api/cursos
Crear un nuevo curso

**Request:**
```bash
curl -X POST http://localhost:3000/api/cursos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_curso": "Inteligencia Artificial",
    "descripcion": "Curso de IA aplicada",
    "id_usuario": 1
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id_curso": 9,
    "nombre_curso": "Inteligencia Artificial",
    "descripcion": "Curso de IA aplicada",
    "estado": "activo",
    "id_usuario": 1,
    "created_at": "2025-10-11T23:14:30.706Z",
    "updated_at": "2025-10-11T23:14:30.706Z"
  },
  "message": "Curso creado exitosamente"
}
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `nombre_curso` | ✅ Sí | No puede estar vacío |
| `id_usuario` | ✅ Sí | Debe ser un ID de usuario válido |
| **Restricción** | - | No permite cursos duplicados con el mismo nombre para el mismo docente |

---

#### PUT /api/cursos/:id
Actualizar un curso existente

**Request:**
```bash
curl -X PUT http://localhost:3000/api/cursos/9 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_curso": "Inteligencia Artificial Avanzada",
    "descripcion": "Curso actualizado de IA"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id_curso": 9,
    "nombre_curso": "Inteligencia Artificial Avanzada",
    "descripcion": "Curso actualizado de IA",
    "estado": "activo",
    "updated_at": "2025-10-11T18:14:39.865Z"
  },
  "message": "Curso actualizado exitosamente"
}
```

---

#### DELETE /api/cursos/:id
Eliminar un curso

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/cursos/9
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Curso eliminado exitosamente"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "No se puede eliminar el curso porque tiene unidades asociadas"
}
```

---

### 📌 **UNIDADES** - 6 endpoints

#### GET /api/unidades
Obtener todas las unidades

**Request:**
```bash
curl http://localhost:3000/api/unidades
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_unidad": 1,
      "titulo_unidad": "Unidad 1: Introducción",
      "descripcion": "Fundamentos avanzados",
      "numero_unidad": 1,
      "id_curso": 1,
      "created_at": "2025-09-18T06:12:54.075Z",
      "updated_at": "2025-10-03T01:41:37.433Z",
      "curso": {
        "id_curso": 1,
        "nombre_curso": "Sistemas Dinámicos Avanzados"
      }
    }
  ],
  "message": "Unidades obtenidas exitosamente"
}
```

---

#### GET /api/unidades/curso/:cursoId
Obtener todas las unidades de un curso específico

**Request:**
```bash
curl http://localhost:3000/api/unidades/curso/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_unidad": 1,
      "titulo_unidad": "Unidad 1: Introducción",
      "numero_unidad": 1
    }
  ],
  "message": "Unidades del curso obtenidas exitosamente"
}
```

---

#### GET /api/unidades/:id
Obtener una unidad específica por ID

**Request:**
```bash
curl http://localhost:3000/api/unidades/1
```

---

#### POST /api/unidades
Crear una nueva unidad

**Request:**
```bash
curl -X POST http://localhost:3000/api/unidades \
  -H "Content-Type: application/json" \
  -d '{
    "titulo_unidad": "Unidad 2: Machine Learning",
    "descripcion": "Introducción a ML",
    "numero_unidad": 2,
    "id_curso": 1
  }'
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `titulo_unidad` | ✅ Sí | No puede estar vacío |
| `numero_unidad` | ✅ Sí | Debe ser un número único en el curso |
| `id_curso` | ✅ Sí | El curso debe existir en la BD |
| **Restricción** | - | No permite números de unidad duplicados en el mismo curso |

---

#### PUT /api/unidades/:id
Actualizar una unidad existente

**Request:**
```bash
curl -X PUT http://localhost:3000/api/unidades/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo_unidad": "Unidad 1: Introducción ACTUALIZADA"
  }'
```

---

#### DELETE /api/unidades/:id
Eliminar una unidad

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/unidades/1
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "No se puede eliminar la unidad porque tiene actividades asociadas"
}
```

---

### 📌 **ACTIVIDADES** - 6 endpoints

#### GET /api/actividades
Obtener todas las actividades con información de unidad y curso

**Request:**
```bash
curl http://localhost:3000/api/actividades
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_actividad": 5,
      "nombre_actividad": "Tarea 1: Proyecto Grupal",
      "descripcion": "Implementar un sistema...",
      "fecha_limite": "2026-01-15T05:00:00.000Z",
      "tipo_actividad": "grupal",
      "id_unidad": 1,
      "id_usuario": 2,
      "id_rubrica": null,
      "unidad": {
        "id_unidad": 1,
        "titulo_unidad": "Unidad 1: Introducción",
        "numero_unidad": 1,
        "curso": {
          "id_curso": 1,
          "nombre_curso": "Sistemas Dinámicos Avanzados"
        }
      }
    }
  ],
  "message": "Actividades obtenidas exitosamente"
}
```

---

#### GET /api/actividades/unidad/:unidadId
Obtener todas las actividades de una unidad específica

**Request:**
```bash
curl http://localhost:3000/api/actividades/unidad/1
```

---

#### GET /api/actividades/:id
Obtener una actividad específica por ID

**Request:**
```bash
curl http://localhost:3000/api/actividades/5
```

---

#### POST /api/actividades
Crear una nueva actividad

**Request:**
```bash
curl -X POST http://localhost:3000/api/actividades \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_actividad": "Práctica de Laboratorio",
    "descripcion": "Implementar algoritmo X",
    "fecha_limite": "2025-12-31",
    "tipo_actividad": "individual",
    "id_unidad": 1,
    "id_usuario": 1
  }'
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `nombre_actividad` | ✅ Sí | No puede estar vacío |
| `fecha_limite` | ✅ Sí | Formato fecha válido (YYYY-MM-DD) |
| `tipo_actividad` | ✅ Sí | Solo acepta: `'individual'` o `'grupal'` |
| `id_unidad` | ✅ Sí | La unidad debe existir en la BD |
| `id_usuario` | ✅ Sí | Debe ser un ID de usuario válido |
| `id_rubrica` | ❌ No | (Opcional) ID de rúbrica si se desea asignar |

---

#### PUT /api/actividades/:id
Actualizar una actividad existente

**Request:**
```bash
curl -X PUT http://localhost:3000/api/actividades/5 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_actividad": "Tarea 1: Proyecto Grupal ACTUALIZADO",
    "fecha_limite": "2026-02-15"
  }'
```

---

#### DELETE /api/actividades/:id
Eliminar una actividad

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/actividades/5
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "No se puede eliminar la actividad porque tiene entregas asociadas"
}
```

---

## 2️⃣ GESTIÓN DE ENTREGAS (8 endpoints)

### 📌 **ENTREGAS** - Vista Docente

#### GET /api/entregas
Obtener todas las entregas con información completa

**Request:**
```bash
curl http://localhost:3000/api/entregas
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_entrega": 5,
      "fecha_entrega": "2025-10-10T21:15:23.601Z",
      "id_actividad": 7,
      "id_usuario": 1,
      "id_grupo": null,
      "num_intento": 1,
      "actividad": {
        "id_actividad": 7,
        "nombre_actividad": "Tarea para la unidad 8",
        "tipo_actividad": "individual",
        "fecha_limite": "2025-12-31T05:00:00.000Z",
        "unidad": {
          "titulo_unidad": "Introducción a la Robótica",
          "numero_unidad": 1,
          "curso": {
            "nombre_curso": "Robótica Aplicada"
          }
        }
      },
      "archivos": [
        {
          "id_archivo_entrega": 8,
          "nombre_archivo": "tarea_robotica.pdf",
          "tipo_archivo": "pdf",
          "url_archivo": "/uploads/tarea_robotica.pdf"
        }
      ]
    }
  ],
  "message": "Entregas obtenidas exitosamente"
}
```

---

#### GET /api/entregas/:id
Obtener una entrega específica por ID

**Request:**
```bash
curl http://localhost:3000/api/entregas/5
```

---

#### GET /api/entregas/actividad/:actividadId
Obtener todas las entregas de una actividad específica

**Request:**
```bash
curl http://localhost:3000/api/entregas/actividad/7
```

---

#### GET /api/entregas/curso/:cursoId
Obtener todas las entregas de un curso específico

**Request:**
```bash
curl http://localhost:3000/api/entregas/curso/1
```

---

#### GET /api/entregas/usuario/:usuarioId
Obtener todas las entregas de un usuario (estudiante)

**Request:**
```bash
curl http://localhost:3000/api/entregas/usuario/1
```

---

#### GET /api/entregas/estadisticas
Obtener estadísticas generales de entregas

**Request:**
```bash
curl http://localhost:3000/api/entregas/estadisticas
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_entregas": 150,
    "entregas_por_estado": {
      "a_tiempo": 120,
      "tarde": 30
    },
    "promedio_intentos": 1.5
  },
  "message": "Estadísticas obtenidas exitosamente"
}
```

---

#### DELETE /api/entregas/:id
Eliminar una entrega (solo docente)

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/entregas/5
```

---

#### DELETE /api/entregas/:entregaId/archivo/:archivoId
Eliminar un archivo específico de una entrega

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/entregas/5/archivo/8
```

---

## 4️⃣ GESTIÓN DE GRUPOS (8 endpoints)

### 📌 **GRUPOS** - Para actividades grupales

#### GET /api/grupos
Obtener todos los grupos

**Request:**
```bash
curl http://localhost:3000/api/grupos
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_grupo": 1,
      "nombre_grupo": "Grupo A",
      "id_actividad": 5,
      "created_at": "2025-10-10T09:07:16.851Z",
      "actividad": {
        "id_actividad": 5,
        "nombre_actividad": "Tarea 1: Proyecto Grupal",
        "tipo_actividad": "grupal"
      },
      "miembros": [
        {
          "id_miembro": 2,
          "id_usuario": 1,
          "rol_miembro": "integrante",
          "fecha_ingreso": "2025-10-10T09:07:56.471Z"
        },
        {
          "id_miembro": 6,
          "id_usuario": 4,
          "rol_miembro": "líder",
          "fecha_ingreso": "2025-10-10T10:15:01.263Z"
        }
      ]
    }
  ],
  "message": "Grupos obtenidos exitosamente"
}
```

---

#### GET /api/grupos/actividad/:actividadId
Obtener todos los grupos de una actividad específica

**Request:**
```bash
curl http://localhost:3000/api/grupos/actividad/5
```

---

#### GET /api/grupos/:id
Obtener un grupo específico por ID con sus miembros

**Request:**
```bash
curl http://localhost:3000/api/grupos/1
```

---

#### POST /api/grupos
Crear un nuevo grupo

**Request:**
```bash
curl -X POST http://localhost:3000/api/grupos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_grupo": "Grupo B",
    "id_actividad": 5
  }'
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `nombre_grupo` | ✅ Sí | No puede estar vacío |
| `id_actividad` | ✅ Sí | La actividad debe existir y ser tipo `'grupal'` |
| **Restricción** | - | Solo actividades grupales pueden tener grupos |
| **Restricción** | - | No permite nombres de grupo duplicados en la misma actividad |

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id_grupo": 2,
    "nombre_grupo": "Grupo B",
    "id_actividad": 5,
    "created_at": "2025-10-10T10:05:11.854Z"
  },
  "message": "Grupo creado exitosamente"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Solo se pueden crear grupos para actividades de tipo grupal"
}
```

---

#### PUT /api/grupos/:id
Actualizar un grupo existente

**Request:**
```bash
curl -X PUT http://localhost:3000/api/grupos/2 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_grupo": "Grupo B - ACTUALIZADO"
  }'
```

---

#### DELETE /api/grupos/:id
Eliminar un grupo

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/grupos/2
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "No se puede eliminar el grupo porque tiene entregas asociadas"
}
```

---

#### POST /api/grupos/:id/miembros
Agregar un miembro al grupo

**Request:**
```bash
curl -X POST http://localhost:3000/api/grupos/1/miembros \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 3,
    "rol_miembro": "integrante"
  }'
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `id_usuario` | ✅ Sí | Debe ser un ID de usuario válido |
| `rol_miembro` | ❌ No | Valores: `'líder'` o `'integrante'` (default: `'integrante'`) |
| **Restricción** | - | El usuario no puede estar ya en el grupo |

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id_miembro": 7,
    "id_grupo": 1,
    "id_usuario": 3,
    "rol_miembro": "integrante",
    "fecha_ingreso": "2025-10-11T18:30:00.000Z"
  },
  "message": "Miembro agregado al grupo exitosamente"
}
```

---

#### DELETE /api/grupos/:id/miembros/:miembroId
Eliminar un miembro del grupo

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/grupos/1/miembros/7
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Miembro eliminado del grupo exitosamente"
}
```

---

## 5️⃣ SISTEMA DE COMENTARIOS (5 endpoints)

### 📌 **COMENTARIOS** - Feedback sobre entregas

#### GET /api/comentarios/entrega/:entregaId
Obtener todos los comentarios de una entrega

**Request:**
```bash
curl http://localhost:3000/api/comentarios/entrega/5
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_comentario": 1,
      "id_entrega": 5,
      "id_usuario": 1,
      "contenido": "Excelente trabajo, pero podrías mejorar...",
      "fecha_comentario": "2025-10-10T21:20:00.000Z"
    }
  ],
  "message": "Comentarios obtenidos exitosamente"
}
```

---

#### GET /api/comentarios/:id
Obtener un comentario específico por ID

**Request:**
```bash
curl http://localhost:3000/api/comentarios/1
```

---

#### POST /api/comentarios
Crear un nuevo comentario

**Request:**
```bash
curl -X POST http://localhost:3000/api/comentarios \
  -H "Content-Type: application/json" \
  -d '{
    "id_entrega": 5,
    "id_usuario": 1,
    "contenido": "Buen trabajo, pero revisa la sección 3"
  }'
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `id_entrega` | ✅ Sí | La entrega debe existir en la BD |
| `id_usuario` | ✅ Sí | Debe ser un ID de usuario válido (docente) |
| `contenido` | ✅ Sí | No puede estar vacío |

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id_comentario": 2,
    "id_entrega": 5,
    "id_usuario": 1,
    "contenido": "Buen trabajo, pero revisa la sección 3",
    "fecha_comentario": "2025-10-11T18:35:00.000Z"
  },
  "message": "Comentario creado exitosamente"
}
```

---

#### PUT /api/comentarios/:id
Actualizar un comentario existente

**Request:**
```bash
curl -X PUT http://localhost:3000/api/comentarios/2 \
  -H "Content-Type: application/json" \
  -d '{
    "contenido": "Excelente trabajo en general",
    "id_usuario": 1
  }'
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `contenido` | ✅ Sí | El nuevo contenido del comentario |
| `id_usuario` | ✅ Sí | Solo el autor original puede editar |
| **Restricción** | - | Si el `id_usuario` no coincide con el autor, retorna 403 Forbidden |

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "No tienes permiso para editar este comentario"
}
```

---

#### DELETE /api/comentarios/:id
Eliminar un comentario

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/comentarios/2 \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 1
  }'
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `id_usuario` | ✅ Sí | Solo el autor original puede eliminar |
| **Restricción** | - | Si el `id_usuario` no coincide con el autor, retorna 403 Forbidden |

---

## 6️⃣ GESTIÓN DE MATERIALES (6 endpoints)

### 📌 **MATERIALES** - Documentos de actividades

#### GET /api/materiales
Obtener todos los materiales

**Request:**
```bash
curl http://localhost:3000/api/materiales
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_documento_actividad": 1,
      "id_actividad": 5,
      "nombre_documento": "Guía para el Proyecto Grupal",
      "tipo_documento": "pdf",
      "url_archivo": "https://drive.google.com/file/d/abc123",
      "created_at": "2025-10-10T10:56:08.856Z",
      "actividad": {
        "id_actividad": 5,
        "nombre_actividad": "Tarea 1: Proyecto Grupal",
        "tipo_actividad": "grupal",
        "id_unidad": 1
      }
    }
  ],
  "message": "Materiales obtenidos exitosamente"
}
```

---

#### GET /api/materiales/actividad/:actividadId
Obtener todos los materiales de una actividad específica

**Request:**
```bash
curl http://localhost:3000/api/materiales/actividad/5
```

---

#### GET /api/materiales/:id
Obtener un material específico por ID

**Request:**
```bash
curl http://localhost:3000/api/materiales/1
```

---

#### POST /api/materiales
Crear un nuevo material

**Request:**
```bash
curl -X POST http://localhost:3000/api/materiales \
  -H "Content-Type: application/json" \
  -d '{
    "id_actividad": 5,
    "nombre_documento": "Plantilla de Proyecto",
    "tipo_documento": "docx",
    "url_archivo": "https://drive.google.com/file/d/xyz456"
  }'
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `id_actividad` | ✅ Sí | La actividad debe existir en la BD |
| `nombre_documento` | ✅ Sí | No puede estar vacío |
| `url_archivo` | ✅ Sí | URL válida del archivo |
| `tipo_documento` | ❌ No | Valores: `pdf`, `video`, `ppt`, `doc`, `docx`, `link` (default: `pdf`) |

**💡 Tipos de Documento Soportados:**
- 📄 `pdf` - Documentos PDF
- 🎥 `video` - Videos educativos
- 📊 `ppt` - Presentaciones PowerPoint
- 📝 `doc` / `docx` - Documentos Word
- 🔗 `link` - Enlaces externos

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id_documento_actividad": 5,
    "id_actividad": 5,
    "nombre_documento": "Plantilla de Proyecto",
    "tipo_documento": "docx",
    "url_archivo": "https://drive.google.com/file/d/xyz456",
    "created_at": "2025-10-11T18:40:00.000Z"
  },
  "message": "Material creado exitosamente"
}
```

---

#### PUT /api/materiales/:id
Actualizar un material existente

**Request:**
```bash
curl -X PUT http://localhost:3000/api/materiales/5 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_documento": "Plantilla de Proyecto ACTUALIZADA",
    "url_archivo": "https://drive.google.com/file/d/xyz789"
  }'
```

---

#### DELETE /api/materiales/:id
Eliminar un material

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/materiales/5
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material eliminado exitosamente"
}
```

---

## 📋 CÓDIGOS DE ESTADO HTTP

### Códigos de Éxito
- **200 OK**: Operación exitosa (GET, PUT, DELETE)
- **201 Created**: Recurso creado exitosamente (POST)

### Códigos de Error del Cliente
- **400 Bad Request**: Datos inválidos o validación fallida
- **403 Forbidden**: Sin permisos para realizar la operación
- **404 Not Found**: Recurso no encontrado

### Códigos de Error del Servidor
- **500 Internal Server Error**: Error interno del servidor

---

## 🔧 FORMATO DE RESPUESTAS

### Respuesta Exitosa
```json
{
  "success": true,
  "data": { ... } | [ ... ],
  "message": "Descripción de la operación exitosa"
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error para el usuario",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

---

## 🚀 ENDPOINTS DE UTILIDAD

### GET /
Información general de la API

**Response:**
```json
{
  "message": "API de GradIA - Sistema de Gestión Académica para Docentes",
  "version": "4.0.0",
  "modulos": {
    "gestion_cursos": {...},
    "gestion_entregas": {...},
    "sistema_evaluacion": {...},
    "gestion_grupos": {...},
    "sistema_comentarios": {...},
    "gestion_materiales": {...}
  }
}
```

---

### GET /api/health
Verificar estado de la API y conexión a la base de datos

**Response:**
```json
{
  "status": "OK",
  "database": "Connected",
  "modulos_disponibles": [
    "Gestión de Cursos",
    "Gestión de Entregas",
    "Sistema de Evaluación",
    "Gestión de Grupos",
    "Sistema de Comentarios",
    "Gestión de Materiales"
  ],
  "endpoints_totales": 62,
  "timestamp": "2025-10-11T18:08:32.190Z"
}
```

---

### GET /api/resumen
Resumen completo del proyecto

**Response:**
```json
{
  "proyecto": "GradIA - Module Manager Teacher",
  "descripcion": "API backend completa para la gestión académica desde la perspectiva del docente",
  "modulos_implementados": {
    "gestion_cursos": {
      "tablas": ["curso", "unidad", "actividad"],
      "endpoints": 19,
      "estado": "Completo ✅"
    },
    ...
  },
  "completitud": "100% ✅",
  "tecnologias": ["Node.js", "Express", "Sequelize", "PostgreSQL"],
  "base_datos": "PostgreSQL en Render.com"
}
```

---

## 📊 ARQUITECTURA DE LA BASE DE DATOS

### Jerarquía de Entidades
```
CURSO → UNIDAD → ACTIVIDAD → ENTREGA → EVALUACIÓN
                      ↓
                   GRUPO → MIEMBRO_GRUPO
                      ↓
                  MATERIALES
                      ↓
                 COMENTARIOS
```

### Schemas PostgreSQL
1. **cursos**: curso, unidad
2. **actividades**: actividad, entrega, archivo_entrega, documento_actividad, comentario
3. **evaluaciones**: rubrica, criterio, rubrica_criterio, nivel_criterio, evaluacion, detalle_evaluacion
4. **grupos**: grupo, miembro_grupo

---

## 🔐 NOTA DE SEGURIDAD

Esta documentación muestra los endpoints disponibles. En producción se recomienda:
- Implementar autenticación JWT
- Validar permisos de usuario (docente/estudiante)
- Implementar rate limiting
- Sanitizar inputs
- Encriptar datos sensibles

---

## 📞 SOPORTE

Para reportar bugs o solicitar funcionalidades:
- **Repositorio**: [GitHub - GradIA Module Manager Teacher]
- **Contacto**: equipo-gradia@universidad.edu

---

**Última actualización**: 2025-10-11
**Versión del documento**: 1.0
