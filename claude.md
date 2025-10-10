# GradIA - Module Manager Teacher

## Descripción del Proyecto
API Backend completa para el sistema de gestión académica GradIA desde la perspectiva del docente. Sistema 100% funcional con 62 endpoints operativos que permiten administrar cursos, unidades, actividades, entregas, evaluación con rúbricas, grupos, comentarios y materiales educativos.

## Stack Tecnológico
- **Runtime**: Node.js v20.10.0
- **Framework**: Express.js v4.21.2
- **ORM**: Sequelize v6.37.7
- **Base de Datos**: PostgreSQL en Render.com
- **Middleware**: CORS, body-parser
- **Dev Tools**: Nodemon v3.1.10

---

## 🎉 ESTADO ACTUAL DEL BACKEND: 100% COMPLETADO

### ✅ TODOS LOS MÓDULOS IMPLEMENTADOS (62 endpoints)

#### **1. Gestión de Cursos (19 endpoints)** ✅
- ✅ **Curso.js** - CRUD completo (5 endpoints)
- ✅ **Unidad.js** - CRUD completo (6 endpoints)
- ✅ **Actividad.js** - CRUD completo (8 endpoints)
  - Conectado directamente con Unidad (migración sin sesiones completada)
  - Tipos: `individual` o `grupal`

#### **2. Gestión de Entregas (8 endpoints)** ✅
- ✅ **Entrega.js** - Vista docente implementada
- ✅ **ArchivoEntrega.js** - Gestión de archivos adjuntos
- ✅ Estadísticas de entregas (a tiempo, tardías, etc.)
- ✅ Filtros por actividad, curso, usuario

#### **3. Sistema de Evaluación con Rúbricas (16 endpoints)** ✅
- ✅ **Rubrica.js** - CRUD completo (5 endpoints)
- ✅ **Criterio.js** - CRUD completo (5 endpoints)
- ✅ **RubricaCriterio.js** - Relación rúbrica-criterio
- ✅ **NivelCriterio.js** - Niveles de desempeño
- ✅ **Evaluacion.js** - CRUD completo (6 endpoints)
- ✅ **DetalleEvaluacion.js** - Evaluación detallada por criterio

#### **4. Sistema de Grupos (8 endpoints)** ✅
- ✅ **Grupo.js** - CRUD completo
- ✅ **MiembroGrupo.js** - Gestión de miembros
- ✅ Gestión completa de grupos para actividades grupales
- ✅ Validación: solo actividades tipo `grupal` pueden tener grupos

#### **5. Gestión de Comentarios (5 endpoints)** ✅
- ✅ **Comentario.js** - Feedback en entregas
- ✅ CRUD completo de comentarios
- ✅ Filtros por entrega

#### **6. Sistema de Materiales (6 endpoints)** ✅
- ✅ **MaterialActividad** (DocumentoActividad)
- ✅ Materiales vinculados a actividades (no a unidades)
- ✅ Tipos: pdf, video, ppt, doc, link
- ✅ CRUD completo

**Total: 62 endpoints funcionales** 🎊

---

## 🏗️ ARQUITECTURA FINAL

### Jerarquía del Sistema:
```
CURSO
  └── UNIDAD
       └── ACTIVIDAD (Tarea)
            ├── MATERIALES (Documentos de apoyo)
            ├── GRUPOS (si tipo_actividad = 'grupal')
            │    └── MIEMBROS
            └── ENTREGAS
                 ├── ARCHIVOS
                 ├── COMENTARIOS
                 └── EVALUACIONES (con Rúbricas)
                      └── DETALLES por Criterio
```

### Decisiones Arquitectónicas Clave:
✅ **Migración sin Sesiones** - Completada exitosamente
- Actividad conecta directamente con Unidad
- Tablas de sesión eliminadas de la BD

✅ **Materiales por Actividad** - No por Unidad
- Usa tabla `actividades.documento_actividad`
- Materiales específicos para cada tarea

---

## 🗂️ ESTRUCTURA DE CARPETAS

```
gradia-module-manager-teacher/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── associations.js    ⚠️ CRÍTICO: Define TODAS las relaciones
│   │   ├── Curso.js
│   │   ├── Unidad.js
│   │   ├── Actividad.js
│   │   ├── Entrega.js
│   │   ├── ArchivoEntrega.js
│   │   ├── Rubrica.js
│   │   ├── Criterio.js
│   │   ├── RubricaCriterio.js
│   │   ├── NivelCriterio.js
│   │   ├── Evaluacion.js
│   │   ├── DetalleEvaluacion.js
│   │   ├── Grupo.js
│   │   ├── MiembroGrupo.js
│   │   ├── Comentario.js
│   │   └── MaterialUnidad.js (MaterialActividad)
│   ├── controllers/
│   │   ├── cursoController.js
│   │   ├── unidadController.js
│   │   ├── actividadController.js
│   │   ├── entregaController.js
│   │   ├── rubricaController.js
│   │   ├── criterioController.js
│   │   ├── evaluacionController.js
│   │   ├── grupoController.js
│   │   ├── comentarioController.js
│   │   └── materialController.js
│   └── routes/
│       ├── cursoRoutes.js
│       ├── unidadRoutes.js
│       ├── actividadRoutes.js
│       ├── entregaRoutes.js
│       ├── rubricaRoutes.js
│       ├── criterioRoutes.js
│       ├── evaluacionRoutes.js
│       ├── grupoRoutes.js
│       ├── comentarioRoutes.js
│       └── materialRoutes.js
├── app.js
├── package.json
├── claude.md                  ← Este archivo
└── ENDPOINTS_BACKEND_DOCENTE.md  ← Documentación completa
```

---

## 📐 REGLAS DE DESARROLLO (OBLIGATORIO SEGUIR)

### 1. Nomenclatura

**Archivos:**
- Modelos: `NombreModelo.js` (PascalCase)
- Controllers: `nombreController.js` (camelCase)
- Routes: `nombreRoutes.js` (camelCase)

**Base de Datos:**
- Tablas: `nombre_tabla` (snake_case)
- Campos: `id_campo`, `nombre_campo` (snake_case)
- Schemas: `cursos`, `actividades`, `evaluaciones`, `grupos`

**Código JavaScript:**
- Variables: `miVariable` (camelCase)
- Constantes: `MI_CONSTANTE` (UPPER_SNAKE_CASE)
- Funciones: `miFuncion` (camelCase)

**Endpoints:**
- URLs: `/api/recursos` (plural, lowercase)
- Parámetros: `/api/recursos/:id`

### 2. Formato de Respuestas API (ESTÁNDAR OBLIGATORIO)

**Éxito:**
```javascript
{
  "success": true,
  "data": { ... } | [ ... ],
  "message": "Descripción clara de la operación"
}
```

**Error:**
```javascript
{
  "success": false,
  "message": "Descripción del error para el usuario",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

### 3. Estructura de Controladores (PATRÓN OBLIGATORIO)

Orden de métodos en TODOS los controladores:
1. `getAllRecursos` - GET todos
2. `getRecursoById` - GET uno por ID
3. `getRecursosByPadre` - GET filtrado por recurso padre
4. `createRecurso` - POST crear
5. `updateRecurso` - PUT actualizar
6. `deleteRecurso` - DELETE eliminar

### 4. Validaciones OBLIGATORIAS

SIEMPRE implementar en este orden:

1. **Validar campos requeridos**
   - Retornar 400 si falta un campo obligatorio
   - Mensaje: "El campo X es obligatorio"

2. **Verificar existencia de recursos padre**
   - Usar `findByPk` para validar FK
   - Retornar 404 si no existe
   - Mensaje: "Recurso padre no encontrado"

3. **Prevenir duplicados** (si aplica)
   - Usar `findOne` con condición única
   - Retornar 400 si ya existe
   - Mensaje: "Ya existe un recurso con ese valor"

4. **Validar ENUMs y tipos especiales**
   - Ejemplo: `tipo_actividad` solo acepta 'individual' o 'grupal'
   - Retornar 400 si valor inválido

5. **Restricciones de eliminación**
   - Verificar con `count` si tiene recursos hijos
   - Retornar 400 si no se puede eliminar
   - Mensaje: "No se puede eliminar porque tiene recursos asociados"

### 5. Manejo de Errores (OBLIGATORIO)

SIEMPRE usar try-catch en funciones async:
```javascript
try {
  // Lógica
} catch (error) {
  console.error('Error al [operación]:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: error.message
  });
}
```

### 6. Modelos Sequelize (PATRÓN ESTÁNDAR)

Estructura obligatoria:
- Definir todos los campos con `field` mapeando a snake_case
- Incluir `created_at` (y `updated_at` si existe en la tabla)
- `timestamps: false` (manejamos manualmente)
- Especificar `tableName` y `schema` explícitamente
- NO definir relaciones en modelos (van en `associations.js`)

### 7. Relaciones (associations.js)

Reglas críticas:
- Todas las relaciones se definen ÚNICAMENTE en `associations.js`
- Usar alias descriptivos: `as: 'unidades'`, `as: 'curso'`
- `hasMany` para relaciones 1:N
- `belongsTo` para el lado inverso N:1
- Exportar TODOS los modelos desde este archivo
- IMPORTAR en `app.js` ANTES de las rutas ⚠️ CRÍTICO

### 8. Códigos de Estado HTTP

- **200**: GET exitoso
- **201**: POST creación exitosa
- **400**: Error de validación / Bad Request
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

### 9. Logging

- Loggear TODAS las requests: `${timestamp} - ${method} ${path}`
- `console.error` para errores importantes
- SQL logging desactivado: `logging: false`

### 10. Includes en Queries Sequelize

Para obtener relaciones anidadas:
- Usar `include` con array de objetos
- Especificar `model`, `as`, y `attributes` para optimizar
- Usar `order` para ordenar resultados
- Limitar campos con `attributes` cuando sea posible

---

## 📊 SCHEMAS DE BASE DE DATOS

### Schema: `cursos`
- `curso` - Información de cursos
- `unidad` - Unidades de cada curso

### Schema: `actividades`
- `actividad` - Tareas/actividades
- `entrega` - Entregas de estudiantes
- `archivo_entrega` - Archivos adjuntos a entregas
- `comentario` - Comentarios de docentes en entregas
- `documento_actividad` - Materiales de apoyo por actividad (PDFs, videos, links)

### Schema: `evaluaciones`
- `rubrica` - Rúbricas de evaluación
- `criterio` - Criterios de evaluación
- `rubrica_criterio` - Relación rúbrica-criterio
- `nivel_criterio` - Niveles de desempeño por criterio
- `evaluacion` - Evaluaciones de entregas
- `detalle_evaluacion` - Detalles de evaluación por criterio

### Schema: `grupos`
- `grupo` - Grupos para actividades grupales
- `miembro_grupo` - Miembros de cada grupo

### Schema: `mantenimiento_usuarios` (Gestión de usuarios - NO implementado en backend docente)
- `usuario` - Usuarios del sistema
- `rol` - Roles de usuarios
- `rol_permiso` - Permisos por rol
- `usuario_rol` - Asignación de roles a usuarios
- `refresh_token` - Tokens de autenticación
- `log_auditoria` - Registro de acciones

### Schema: `emociones` (Módulo de emociones - NO implementado)
- `emocion` - Emociones registradas
- `emocion_detectada` - Detección de emociones

---

## 🚀 ENDPOINTS PRINCIPALES

Para la documentación completa de los 62 endpoints, consultar:
**[ENDPOINTS_BACKEND_DOCENTE.md](ENDPOINTS_BACKEND_DOCENTE.md)**

### Resumen por Módulo:

#### Cursos y Contenido (19 endpoints)
- `/api/cursos` - Gestión de cursos
- `/api/unidades` - Gestión de unidades
- `/api/actividades` - Gestión de actividades/tareas

#### Entregas (8 endpoints)
- `/api/entregas` - Gestión de entregas
- `/api/entregas/estadisticas` - Dashboard de estadísticas

#### Evaluación (16 endpoints)
- `/api/rubricas` - Gestión de rúbricas
- `/api/criterios` - Gestión de criterios
- `/api/evaluaciones` - Crear y gestionar evaluaciones

#### Grupos (8 endpoints)
- `/api/grupos` - Gestión de grupos
- `/api/grupos/:id/miembros` - Gestión de miembros

#### Comentarios (5 endpoints)
- `/api/comentarios` - Feedback en entregas

#### Materiales (6 endpoints)
- `/api/materiales` - Documentos de apoyo por actividad

---

## 🔐 SEGURIDAD Y PRÓXIMOS PASOS

### ⚠️ Actualmente NO implementado:
- [ ] Autenticación JWT
- [ ] Validación de roles (RBAC)
- [ ] Verificación de permisos por recurso
- [ ] Rate limiting
- [ ] Validación de inputs con Joi/Yup

### 📝 Fase 2 - Recomendaciones:
1. **Seguridad**
   - Implementar autenticación JWT
   - Middleware de autorización por rol
   - Validación de permisos por recurso

2. **Testing**
   - Tests unitarios con Jest
   - Tests de integración
   - Cobertura mínima 70%

3. **Documentación**
   - Swagger/OpenAPI
   - Postman Collection actualizada

4. **Performance**
   - Paginación en listados
   - Índices optimizados en BD
   - Caching con Redis

5. **DevOps**
   - Docker/Docker Compose
   - CI/CD pipeline
   - Monitoring y logging centralizado

6. **Módulos Opcionales**
   - Gestión de Estudiantes (inscripciones, historial)
   - Dashboard con analytics avanzados
   - Sistema de notificaciones
   - Exportación de reportes (PDF, Excel)
   - Alertas automáticas

---

## 💡 EJEMPLOS DE USO

### Crear Curso Completo
```javascript
// 1. Crear Curso
POST /api/cursos
{
  "nombre_curso": "Programación Avanzada",
  "descripcion": "Curso de algoritmos",
  "estado": "activo",
  "id_usuario": 1
}

// 2. Crear Unidad
POST /api/unidades
{
  "titulo_unidad": "Unidad 1: Ordenamiento",
  "numero_unidad": 1,
  "id_curso": 1
}

// 3. Crear Actividad Grupal
POST /api/actividades
{
  "nombre_actividad": "Proyecto Final",
  "tipo_actividad": "grupal",
  "id_unidad": 1,
  "id_usuario": 1,
  "fecha_limite": "2025-12-31"
}

// 4. Subir Material de Apoyo
POST /api/materiales
{
  "id_actividad": 1,
  "nombre_documento": "Guía del Proyecto",
  "tipo_documento": "pdf",
  "url_archivo": "https://drive.google.com/..."
}

// 5. Crear Grupo
POST /api/grupos
{
  "nombre_grupo": "Grupo A",
  "id_actividad": 1
}

// 6. Agregar Miembros
POST /api/grupos/1/miembros
{
  "id_usuario": 10,
  "rol_miembro": "lider"
}
```

### Evaluar con Rúbrica
```javascript
// 1. Crear Rúbrica
POST /api/rubricas
{
  "nombre_rubrica": "Rúbrica de Código",
  "id_usuario": 1
}

// 2. Obtener Entregas
GET /api/entregas/actividad/1

// 3. Evaluar
POST /api/evaluaciones
{
  "id_entrega": 1,
  "id_usuario": 1,
  "puntuacion_total": 90,
  "comentarios": "Excelente trabajo",
  "detalles": [...]
}

// 4. Agregar Comentario
POST /api/comentarios
{
  "id_entrega": 1,
  "id_usuario": 1,
  "contenido": "Revisa la documentación del código"
}
```

---

## 📈 ESTADÍSTICAS DEL PROYECTO

### Backend Docente Implementado:
- **Total de Endpoints**: 62
- **Modelos Sequelize**: 16
- **Controllers**: 10
- **Rutas**: 10
- **Completitud**: 100% ✅

### Base de Datos Completa:
- **Schemas en PostgreSQL**: 6 (cursos, actividades, evaluaciones, grupos, mantenimiento_usuarios, emociones)
- **Tablas implementadas en backend**: 16
- **Tablas totales en BD**: ~26 (incluye módulos de autenticación y emociones)

---

## 🎯 MISIÓN CUMPLIDA

El backend del área docente de GradIA está **100% funcional** y listo para producción (con las consideraciones de seguridad pendientes).

**Características principales:**
✅ Gestión completa de cursos y contenido académico
✅ Sistema robusto de evaluación con rúbricas
✅ Gestión de grupos para trabajo colaborativo
✅ Sistema de comentarios para feedback detallado
✅ Materiales educativos por actividad
✅ Seguimiento de entregas con estadísticas
✅ Arquitectura escalable y mantenible
✅ Código limpio siguiendo patrones MVC
✅ Documentación completa

---

**Última actualización:** 2025-10-10
**Versión del API:** 3.0.0
**Estado:** ✅ Producción (sin autenticación)
