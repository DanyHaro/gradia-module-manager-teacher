# 📚 ENDPOINTS BACKEND DOCENTE - GradIA

## 🎯 Información General

**Backend API REST completo para el módulo docente de GradIA**

| Información | Detalle |
|-------------|---------|
| **Estado** | ✅ 100% Funcional |
| **Total de Endpoints** | 62 endpoints operativos |
| **Base de Datos** | PostgreSQL en Render.com |
| **Stack Tecnológico** | Node.js + Express.js + Sequelize |
| **Arquitectura** | Patrón MVC |
| **Base URL** | `http://localhost:3000` |
| **Versión** | 4.0.0 |

---

## 📋 ÍNDICE DE MÓDULOS

| # | Módulo | Endpoints | Estado |
|---|--------|-----------|--------|
| 1 | [Gestión de Cursos](#1️⃣-gestión-de-cursos) | 19 | ✅ |
| 2 | [Gestión de Entregas](#2️⃣-gestión-de-entregas) | 8 | ✅ |
| 3 | [Sistema de Evaluación](#3️⃣-sistema-de-evaluación-con-rúbricas) | 16 | ✅ |
| 4 | [Gestión de Grupos](#4️⃣-gestión-de-grupos) | 8 | ✅ |
| 5 | [Sistema de Comentarios](#5️⃣-sistema-de-comentarios) | 5 | ✅ |
| 6 | [Gestión de Materiales](#6️⃣-gestión-de-materiales) | 6 | ✅ |

**Total:** 62 endpoints

---

## 🏗️ JERARQUÍA DEL SISTEMA

```
📚 CURSO
   └── 📖 UNIDAD
        └── 📝 ACTIVIDAD (Tarea)
             ├── 📎 MATERIALES (Documentos de apoyo)
             │    └── Archivos PDF, Videos, PPT, Links
             │
             ├── 👥 GRUPOS (Solo si tipo_actividad = 'grupal')
             │    └── 👤 MIEMBROS
             │         ├── Líder
             │         └── Integrantes
             │
             └── 📤 ENTREGAS
                  ├── 📁 ARCHIVOS ADJUNTOS
                  ├── 💬 COMENTARIOS (Feedback docente)
                  └── ⭐ EVALUACIONES
                       ├── 📊 RÚBRICA
                       │    └── CRITERIOS
                       │         └── NIVELES
                       └── 📋 DETALLES (por criterio)
```

---

## 1️⃣ GESTIÓN DE CURSOS

**Total:** 19 endpoints (Cursos: 5 | Unidades: 6 | Actividades: 6 | Sesiones: 2)

### 📌 Cursos - `/api/cursos` (5 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/cursos` | Listar todos los cursos con sus unidades |
| `GET` | `/api/cursos/:id` | Obtener curso específico por ID |
| `POST` | `/api/cursos` | Crear nuevo curso |
| `PUT` | `/api/cursos/:id` | Actualizar curso existente |
| `DELETE` | `/api/cursos/:id` | Eliminar curso (sin unidades asociadas) |

**Campos principales:** `nombre_curso`, `descripcion`, `estado`, `id_usuario`

---

### 📌 Unidades - `/api/unidades` (6 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/unidades` | Listar todas las unidades |
| `GET` | `/api/unidades/:id` | Obtener unidad específica por ID |
| `GET` | `/api/unidades/curso/:cursoId` | Obtener todas las unidades de un curso |
| `POST` | `/api/unidades` | Crear nueva unidad |
| `PUT` | `/api/unidades/:id` | Actualizar unidad existente |
| `DELETE` | `/api/unidades/:id` | Eliminar unidad (sin actividades asociadas) |

**Campos principales:** `titulo_unidad`, `descripcion`, `numero_unidad`, `id_curso`

---

### 📌 Actividades - `/api/actividades` (6 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/actividades` | Listar todas las actividades |
| `GET` | `/api/actividades/:id` | Obtener actividad específica por ID |
| `GET` | `/api/actividades/unidad/:unidadId` | Obtener todas las actividades de una unidad |
| `POST` | `/api/actividades` | Crear nueva actividad (tarea) |
| `PUT` | `/api/actividades/:id` | Actualizar actividad existente |
| `DELETE` | `/api/actividades/:id` | Eliminar actividad (sin entregas asociadas) |

**Campos principales:** `nombre_actividad`, `descripcion`, `fecha_limite`, `tipo_actividad`, `id_unidad`, `id_usuario`, `id_rubrica`

**Tipos de actividad:** `individual` | `grupal`

---

## 2️⃣ GESTIÓN DE ENTREGAS

**Total:** 8 endpoints (Vista docente para revisar y gestionar entregas de estudiantes)

### 📌 Entregas - `/api/entregas` (8 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/entregas` | Listar todas las entregas con información completa |
| `GET` | `/api/entregas/:id` | Obtener entrega específica por ID |
| `GET` | `/api/entregas/actividad/:actividadId` | Obtener todas las entregas de una actividad |
| `GET` | `/api/entregas/curso/:cursoId` | Obtener todas las entregas de un curso |
| `GET` | `/api/entregas/usuario/:usuarioId` | Obtener todas las entregas de un estudiante |
| `GET` | `/api/entregas/estadisticas?cursoId=X` | Estadísticas de entregas (dashboard) |
| `DELETE` | `/api/entregas/:id` | Eliminar entrega completa |
| `DELETE` | `/api/entregas/:entregaId/archivo/:archivoId` | Eliminar archivo específico de una entrega |

**Información incluida:** Datos de la actividad, unidad, curso, archivos adjuntos, intentos, estado (a tiempo/tarde)

**Estadísticas disponibles:**
- Total de entregas
- Entregas a tiempo vs tardías
- Promedio de intentos
- Filtros por curso, actividad o usuario

---

## 3️⃣ SISTEMA DE EVALUACIÓN CON RÚBRICAS

**Total:** 16 endpoints (Sistema completo de evaluación mediante rúbricas con criterios y niveles)

### 📌 Rúbricas - `/api/rubricas` (5 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/rubricas` | Listar todas las rúbricas |
| `GET` | `/api/rubricas/:id` | Obtener rúbrica con criterios y niveles |
| `POST` | `/api/rubricas` | Crear nueva rúbrica |
| `PUT` | `/api/rubricas/:id` | Actualizar rúbrica |
| `DELETE` | `/api/rubricas/:id` | Eliminar rúbrica |

**Campos principales:** `nombre_rubrica`, `descripcion`, `id_usuario`

---

### 📌 Criterios - `/api/criterios` (5 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/criterios` | Listar todos los criterios |
| `GET` | `/api/criterios/:id` | Obtener criterio específico |
| `POST` | `/api/criterios` | Crear nuevo criterio |
| `PUT` | `/api/criterios/:id` | Actualizar criterio |
| `DELETE` | `/api/criterios/:id` | Eliminar criterio |

**Campos principales:** `nombre_criterio`, `descripcion`, `id_usuario`

**Relaciones:**
- `rubrica_criterio` - Relación N:N entre rúbricas y criterios
- `nivel_criterio` - Niveles de desempeño por criterio (Excelente, Bueno, Regular, Insuficiente)

---

### 📌 Evaluaciones - `/api/evaluaciones` (6 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/evaluaciones` | Listar todas las evaluaciones |
| `GET` | `/api/evaluaciones/:id` | Obtener evaluación completa con detalles |
| `GET` | `/api/evaluaciones/entrega/:entregaId` | Obtener evaluaciones de una entrega |
| `POST` | `/api/evaluaciones` | Crear evaluación completa con detalles por criterio |
| `PUT` | `/api/evaluaciones/:id` | Actualizar evaluación |
| `DELETE` | `/api/evaluaciones/:id` | Eliminar evaluación |

**Campos principales:** `id_entrega`, `id_usuario`, `puntuacion_total`, `comentarios`, `detalles[]`

**Estructura de detalles:**
- `id_rubrica_criterio` - Relación rúbrica-criterio
- `id_nivel_criterio` - Nivel alcanzado
- `comentario_detalle` - Feedback específico por criterio

---

## 4️⃣ GESTIÓN DE GRUPOS

**Total:** 8 endpoints (Para actividades grupales)

### 📌 Grupos - `/api/grupos` (8 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/grupos` | Listar todos los grupos con sus miembros |
| `GET` | `/api/grupos/:id` | Obtener grupo específico por ID |
| `GET` | `/api/grupos/actividad/:actividadId` | Obtener todos los grupos de una actividad |
| `POST` | `/api/grupos` | Crear nuevo grupo (solo para actividades grupales) |
| `PUT` | `/api/grupos/:id` | Actualizar nombre del grupo |
| `DELETE` | `/api/grupos/:id` | Eliminar grupo (sin entregas asociadas) |
| `POST` | `/api/grupos/:id/miembros` | Agregar estudiante al grupo |
| `DELETE` | `/api/grupos/:id/miembros/:miembroId` | Quitar estudiante del grupo |

**Campos principales:** `nombre_grupo`, `id_actividad`

**Restricción importante:** Solo se pueden crear grupos para actividades de `tipo_actividad = 'grupal'`

**Roles de miembros:** `líder` | `integrante` (default)

---

## 5️⃣ SISTEMA DE COMENTARIOS

**Total:** 5 endpoints (Feedback sobre entregas)

### 📌 Comentarios - `/api/comentarios` (5 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/comentarios/entrega/:entregaId` | Obtener todos los comentarios de una entrega |
| `GET` | `/api/comentarios/:id` | Obtener comentario específico |
| `POST` | `/api/comentarios` | Crear comentario en una entrega |
| `PUT` | `/api/comentarios/:id` | Actualizar comentario (solo autor) |
| `DELETE` | `/api/comentarios/:id` | Eliminar comentario (solo autor) |

**Campos principales:** `id_entrega`, `id_usuario`, `contenido`, `fecha_comentario`

**Validación de permisos:** Solo el autor puede editar o eliminar sus comentarios

---

## 6️⃣ GESTIÓN DE MATERIALES

**Total:** 6 endpoints (Documentos de apoyo por actividad)

### 📌 Materiales - `/api/materiales` (6 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/materiales` | Listar todos los materiales |
| `GET` | `/api/materiales/:id` | Obtener material específico |
| `GET` | `/api/materiales/actividad/:actividadId` | Obtener todos los materiales de una actividad |
| `POST` | `/api/materiales` | Subir material a una actividad |
| `PUT` | `/api/materiales/:id` | Actualizar material |
| `DELETE` | `/api/materiales/:id` | Eliminar material |

**Campos principales:** `id_actividad`, `nombre_documento`, `tipo_documento`, `url_archivo`

**Tipos de documento soportados:**
- 📄 `pdf` - Documentos PDF
- 🎥 `video` - Videos educativos
- 📊 `ppt` - Presentaciones PowerPoint
- 📝 `doc` / `docx` - Documentos Word
- 🔗 `link` - Enlaces externos

**Nota:** Los materiales están vinculados a **actividades**, no a unidades.

---

## 🚀 ENDPOINTS DE UTILIDAD

### Sistema y Monitoreo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Información general de la API y módulos |
| `GET` | `/api/health` | Verificar estado del servidor y conexión a BD |
| `GET` | `/api/resumen` | Resumen completo del proyecto implementado |

---

## 📊 CONVENCIONES DE RESPUESTAS

### ✅ Respuesta Exitosa

```json
{
  "success": true,
  "data": { ... } | [ ... ],
  "message": "Descripción de la operación exitosa"
}
```

### ❌ Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error para el usuario",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

---

## 🔧 CÓDIGOS DE ESTADO HTTP

| Código | Tipo | Significado |
|--------|------|-------------|
| `200` | ✅ Éxito | GET exitoso / Actualización exitosa |
| `201` | ✅ Éxito | Recurso creado exitosamente (POST) |
| `400` | ❌ Error Cliente | Datos inválidos o validación fallida |
| `403` | ❌ Error Cliente | Sin permisos para realizar la operación |
| `404` | ❌ Error Cliente | Recurso no encontrado |
| `500` | ❌ Error Servidor | Error interno del servidor |

---

## 📐 ARQUITECTURA DE BASE DE DATOS

### Schemas PostgreSQL

```
📦 Schema: cursos
   ├── curso
   └── unidad

📦 Schema: actividades
   ├── actividad
   ├── entrega
   ├── archivo_entrega
   ├── documento_actividad
   └── comentario

📦 Schema: evaluaciones
   ├── rubrica
   ├── criterio
   ├── rubrica_criterio
   ├── nivel_criterio
   ├── evaluacion
   └── detalle_evaluacion

📦 Schema: grupos
   ├── grupo
   └── miembro_grupo
```

**Total de tablas implementadas:** 16

---

## 🔗 RELACIONES PRINCIPALES

### Cascadas y Dependencias

```
CURSO (1) ──────→ (N) UNIDAD
UNIDAD (1) ─────→ (N) ACTIVIDAD
ACTIVIDAD (1) ──→ (N) ENTREGA
ACTIVIDAD (1) ──→ (N) GRUPO (solo si tipo='grupal')
ACTIVIDAD (1) ──→ (N) MATERIAL
ENTREGA (1) ────→ (N) ARCHIVO_ENTREGA
ENTREGA (1) ────→ (N) COMENTARIO
ENTREGA (1) ────→ (N) EVALUACION
GRUPO (1) ──────→ (N) MIEMBRO_GRUPO
RUBRICA (N) ←───→ (N) CRITERIO (a través de rubrica_criterio)
EVALUACION (1) ─→ (N) DETALLE_EVALUACION
```

### Reglas de Eliminación

| Recurso | Restricción |
|---------|-------------|
| **Curso** | ❌ No se puede eliminar si tiene unidades |
| **Unidad** | ❌ No se puede eliminar si tiene actividades |
| **Actividad** | ❌ No se puede eliminar si tiene entregas |
| **Grupo** | ❌ No se puede eliminar si tiene entregas |
| **Entrega** | ✅ Se eliminan en cascada sus archivos, comentarios y evaluaciones |

---

## 📝 REGLAS DE NEGOCIO

### 1. Actividades y Grupos
- ✅ Solo actividades con `tipo_actividad = 'grupal'` pueden tener grupos
- ❌ Actividades individuales NO pueden tener grupos
- ✅ Un estudiante NO puede estar en múltiples grupos de la misma actividad

### 2. Entregas
- ✅ Las entregas incluyen automáticamente el estado (a tiempo / tarde)
- ✅ Se permite múltiples intentos de entrega (campo `num_intento`)
- ✅ Las entregas individuales NO tienen `id_grupo`
- ✅ Las entregas grupales SÍ requieren `id_grupo`

### 3. Evaluaciones
- ✅ Una entrega puede tener múltiples evaluaciones
- ✅ Las evaluaciones requieren una rúbrica previamente creada
- ✅ Los detalles de evaluación se crean en la misma transacción que la evaluación

### 4. Comentarios
- ✅ Solo el autor puede editar o eliminar sus propios comentarios
- ✅ Los comentarios están asociados a entregas, no a actividades

### 5. Materiales
- ✅ Los materiales están vinculados a **actividades**, NO a unidades
- ✅ Una actividad puede tener múltiples materiales de diferentes tipos

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

### ⚠️ Actualmente NO implementado:

- ❌ Autenticación JWT
- ❌ Validación de roles (RBAC)
- ❌ Verificación de permisos por recurso
- ❌ Rate limiting
- ❌ Validación de inputs con Joi/Yup

### 📝 Recomendaciones para Fase 2:

1. **Autenticación y Autorización**
   - Implementar JWT en todos los endpoints
   - Middleware de autorización por rol (docente/estudiante)
   - Verificar permisos por recurso

2. **Validación y Seguridad**
   - Implementar validación de schemas con Joi/Yup
   - Sanitización de inputs
   - Protección contra SQL Injection
   - Rate limiting por IP

3. **Testing**
   - Tests unitarios con Jest
   - Tests de integración
   - Cobertura mínima 70%

4. **Performance**
   - Paginación en endpoints de listado
   - Índices optimizados en BD
   - Caching con Redis

5. **DevOps**
   - Docker/Docker Compose
   - CI/CD pipeline
   - Monitoring y logging centralizado

---

## 📈 ESTADÍSTICAS DEL PROYECTO

| Métrica | Cantidad |
|---------|----------|
| **Endpoints Implementados** | 62 |
| **Modelos Sequelize** | 16 |
| **Controllers** | 10 |
| **Archivos de Rutas** | 10 |
| **Tablas en BD** | 16 |
| **Schemas en PostgreSQL** | 4 |
| **Líneas de Código** | ~8,000+ |

### Distribución por Módulo

| Módulo | Endpoints | % del Total |
|--------|-----------|-------------|
| Gestión de Cursos | 19 | 30.6% |
| Sistema de Evaluación | 16 | 25.8% |
| Gestión de Entregas | 8 | 12.9% |
| Gestión de Grupos | 8 | 12.9% |
| Gestión de Materiales | 6 | 9.7% |
| Sistema de Comentarios | 5 | 8.1% |

---

## 📦 MÓDULOS OPCIONALES (Fase 2)

### Funcionalidades Sugeridas:

1. **👥 Gestión de Estudiantes**
   - Inscripción a cursos
   - Historial académico
   - Perfil de estudiante

2. **📧 Sistema de Notificaciones**
   - Notificaciones por email
   - Notificaciones push
   - Alertas de fechas límite

3. **📈 Dashboard Avanzado**
   - Analytics de desempeño
   - Gráficos interactivos
   - Reportes personalizados

4. **📄 Exportación de Reportes**
   - Exportar a PDF
   - Exportar a Excel
   - Reportes por estudiante/curso

5. **🔔 Alertas Automáticas**
   - Recordatorios de entregas
   - Alertas de evaluaciones pendientes
   - Notificaciones de nuevos comentarios

---

## 📞 INFORMACIÓN DE CONTACTO

**Documentación Detallada con Ejemplos:**
- Ver archivo: [DOCUMENTACION_API.md](DOCUMENTACION_API.md)

**Instrucciones del Proyecto:**
- Ver archivo: [CLAUDE.md](CLAUDE.md)

**Repositorio:**
- GitHub: GradIA Module Manager Teacher

---

## 🎯 ESTADO DEL PROYECTO

**✅ BACKEND 100% COMPLETADO**

### ✅ Implementado:
- ✅ Gestión completa de cursos y contenido académico
- ✅ Sistema robusto de evaluación con rúbricas
- ✅ Gestión de grupos para trabajo colaborativo
- ✅ Sistema de comentarios para feedback detallado
- ✅ Materiales educativos por actividad
- ✅ Seguimiento de entregas con estadísticas
- ✅ Arquitectura escalable y mantenible
- ✅ Código limpio siguiendo patrones MVC
- ✅ Documentación completa

### 🔜 Pendiente (Opcional):
- ⏳ Autenticación y autorización
- ⏳ Testing automatizado
- ⏳ Módulos adicionales (estudiantes, notificaciones, etc.)

---

**Última actualización:** 2025-10-11
**Versión del API:** 4.0.0
**Versión de este documento:** 2.0
**Stack:** Node.js v20.10.0 + Express.js v4.21.2 + Sequelize v6.37.7 + PostgreSQL
