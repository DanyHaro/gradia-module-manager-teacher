# 📚 BACKEND DOCENTE - GradIA Module Manager Teacher

## 🎯 Resumen Ejecutivo

**Backend API REST completo para el módulo docente de GradIA**

- **Estado**: ✅ 100% Funcional
- **Total de Endpoints**: 62 endpoints operativos
- **Base de Datos**: PostgreSQL en Render.com
- **Stack**: Node.js + Express.js + Sequelize
- **Arquitectura**: Patrón MVC

---

## 📊 MÓDULOS IMPLEMENTADOS

### 1️⃣ GESTIÓN DE CURSOS (19 endpoints)

#### **Cursos** - `/api/cursos`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cursos` | Obtener todos los cursos |
| GET | `/api/cursos/:id` | Obtener curso por ID |
| POST | `/api/cursos` | Crear nuevo curso |
| PUT | `/api/cursos/:id` | Actualizar curso |
| DELETE | `/api/cursos/:id` | Eliminar curso |

**Body para crear curso:**
```json
{
  "nombre_curso": "Programación Avanzada",
  "descripcion": "Curso de algoritmos y estructuras de datos",
  "estado": "activo",
  "id_usuario": 1
}
```

---

#### **Unidades** - `/api/unidades`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/unidades` | Obtener todas las unidades |
| GET | `/api/unidades/:id` | Obtener unidad por ID |
| GET | `/api/unidades/curso/:cursoId` | Obtener unidades de un curso |
| POST | `/api/unidades` | Crear nueva unidad |
| PUT | `/api/unidades/:id` | Actualizar unidad |
| DELETE | `/api/unidades/:id` | Eliminar unidad |

**Body para crear unidad:**
```json
{
  "titulo_unidad": "Introducción a Algoritmos",
  "descripcion": "Fundamentos de algoritmos",
  "numero_unidad": 1,
  "id_curso": 1
}
```

---

#### **Actividades** - `/api/actividades`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/actividades` | Obtener todas las actividades |
| GET | `/api/actividades/:id` | Obtener actividad por ID |
| GET | `/api/actividades/unidad/:unidadId` | Obtener actividades de una unidad |
| POST | `/api/actividades` | Crear nueva actividad (tarea) |
| PUT | `/api/actividades/:id` | Actualizar actividad |
| DELETE | `/api/actividades/:id` | Eliminar actividad |

**Body para crear actividad:**
```json
{
  "nombre_actividad": "Tarea 1: Ordenamiento",
  "descripcion": "Implementar algoritmos de ordenamiento",
  "fecha_limite": "2025-12-31",
  "tipo_actividad": "individual",
  "id_unidad": 1,
  "id_usuario": 1,
  "id_rubrica": null
}
```

**Tipos de actividad:** `"individual"` o `"grupal"`

---

### 2️⃣ GESTIÓN DE ENTREGAS (8 endpoints)

#### **Entregas** - `/api/entregas`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/entregas` | Obtener todas las entregas |
| GET | `/api/entregas/:id` | Obtener entrega por ID |
| GET | `/api/entregas/actividad/:actividadId` | Entregas de una actividad (con estadísticas) |
| GET | `/api/entregas/curso/:cursoId` | Entregas de un curso |
| GET | `/api/entregas/usuario/:usuarioId` | Entregas de un estudiante |
| GET | `/api/entregas/estadisticas?cursoId=1` | Estadísticas de entregas (dashboard) |
| DELETE | `/api/entregas/:id` | Eliminar entrega |
| DELETE | `/api/entregas/:entregaId/archivos/:archivoId` | Eliminar archivo de entrega |

**Respuesta con estadísticas:**
```json
{
  "success": true,
  "data": {
    "entregas": [...],
    "estadisticas": {
      "total_entregas": 25,
      "entregas_a_tiempo": 20,
      "entregas_tardias": 5
    }
  }
}
```

---

### 3️⃣ SISTEMA DE EVALUACIÓN CON RÚBRICAS (16 endpoints)

#### **Rúbricas** - `/api/rubricas`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/rubricas` | Obtener todas las rúbricas |
| GET | `/api/rubricas/:id` | Obtener rúbrica por ID (con criterios y niveles) |
| POST | `/api/rubricas` | Crear nueva rúbrica |
| PUT | `/api/rubricas/:id` | Actualizar rúbrica |
| DELETE | `/api/rubricas/:id` | Eliminar rúbrica |

**Body para crear rúbrica:**
```json
{
  "nombre_rubrica": "Rúbrica de Proyecto Final",
  "descripcion": "Evaluación del proyecto integrador",
  "id_usuario": 1
}
```

---

#### **Criterios** - `/api/criterios`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/criterios` | Obtener todos los criterios |
| GET | `/api/criterios/:id` | Obtener criterio por ID |
| POST | `/api/criterios` | Crear nuevo criterio |
| PUT | `/api/criterios/:id` | Actualizar criterio |
| DELETE | `/api/criterios/:id` | Eliminar criterio |

**Body para crear criterio:**
```json
{
  "nombre_criterio": "Calidad del Código",
  "descripcion": "Evaluación de buenas prácticas",
  "id_usuario": 1
}
```

---

#### **Evaluaciones** - `/api/evaluaciones`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/evaluaciones` | Obtener todas las evaluaciones |
| GET | `/api/evaluaciones/:id` | Obtener evaluación completa (con detalles) |
| GET | `/api/evaluaciones/entrega/:entregaId` | Evaluaciones de una entrega |
| POST | `/api/evaluaciones` | Crear evaluación completa |
| PUT | `/api/evaluaciones/:id` | Actualizar evaluación |
| DELETE | `/api/evaluaciones/:id` | Eliminar evaluación |

**Body para crear evaluación:**
```json
{
  "id_entrega": 1,
  "id_usuario": 1,
  "puntuacion_total": 85,
  "comentarios": "Buen trabajo en general",
  "detalles": [
    {
      "id_rubrica_criterio": 1,
      "id_nivel_criterio": 3,
      "comentario_detalle": "Excelente organización"
    }
  ]
}
```

---

### 4️⃣ SISTEMA DE GRUPOS (8 endpoints)

#### **Grupos** - `/api/grupos`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/grupos` | Obtener todos los grupos |
| GET | `/api/grupos/:id` | Obtener grupo por ID (con miembros) |
| GET | `/api/grupos/actividad/:actividadId` | Grupos de una actividad |
| POST | `/api/grupos` | Crear nuevo grupo (solo para actividades grupales) |
| PUT | `/api/grupos/:id` | Actualizar nombre del grupo |
| DELETE | `/api/grupos/:id` | Eliminar grupo (sin entregas) |
| POST | `/api/grupos/:id/miembros` | Agregar estudiante al grupo |
| DELETE | `/api/grupos/:id/miembros/:miembroId` | Quitar estudiante del grupo |

**Body para crear grupo:**
```json
{
  "nombre_grupo": "Grupo A",
  "id_actividad": 5
}
```

**Body para agregar miembro:**
```json
{
  "id_usuario": 1,
  "rol_miembro": "integrante"
}
```

**Roles disponibles:** `"integrante"` (por defecto) o `"lider"`

---

### 5️⃣ GESTIÓN DE COMENTARIOS (5 endpoints)

#### **Comentarios** - `/api/comentarios`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/comentarios/entrega/:entregaId` | Comentarios de una entrega |
| GET | `/api/comentarios/:id` | Obtener comentario específico |
| POST | `/api/comentarios` | Crear comentario en entrega |
| PUT | `/api/comentarios/:id` | Actualizar comentario |
| DELETE | `/api/comentarios/:id` | Eliminar comentario |

**Body para crear comentario:**
```json
{
  "id_entrega": 2,
  "id_usuario": 1,
  "contenido": "Excelente trabajo, revisa la ortografía en la página 3."
}
```

**Body para actualizar comentario:**
```json
{
  "contenido": "Muy buen trabajo! Solo ajusta el formato de las referencias."
}
```

---

### 6️⃣ SISTEMA DE MATERIALES (6 endpoints)

#### **Materiales por Actividad** - `/api/materiales`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/materiales` | Obtener todos los materiales |
| GET | `/api/materiales/:id` | Obtener material por ID |
| GET | `/api/materiales/actividad/:actividadId` | Materiales de una actividad |
| POST | `/api/materiales` | Subir material a una actividad |
| PUT | `/api/materiales/:id` | Actualizar material |
| DELETE | `/api/materiales/:id` | Eliminar material |

**Body para crear material:**
```json
{
  "id_actividad": 5,
  "nombre_documento": "Guía para el Proyecto Grupal",
  "tipo_documento": "pdf",
  "url_archivo": "https://drive.google.com/file/d/abc123"
}
```

**Tipos de documento:** `"pdf"`, `"video"`, `"ppt"`, `"doc"`, `"link"`

---

## 🔗 JERARQUÍA DEL SISTEMA

```
Curso
  └── Unidad
       └── Actividad (Tarea)
            ├── Materiales (Documentos de apoyo)
            ├── Grupos (si es tipo "grupal")
            │    └── Miembros
            └── Entregas
                 ├── Archivos
                 ├── Comentarios
                 └── Evaluaciones (con Rúbricas)
                      └── Detalles por Criterio
```

---

## 🚀 ENDPOINTS ESPECIALES

### Health Check
```
GET /api/health
```
Verifica el estado de la conexión a la base de datos.

### Información del API
```
GET /
```
Retorna información general del API y módulos disponibles.

### Resumen del Sistema
```
GET /api/resumen
```
Retorna resumen completo de módulos implementados.

---

## 📋 CONVENCIONES DE RESPUESTA

### ✅ Respuesta Exitosa
```json
{
  "success": true,
  "data": { ... } | [ ... ],
  "message": "Operación exitosa"
}
```

### ❌ Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

---

## 🔧 CÓDIGOS DE ESTADO HTTP

| Código | Significado |
|--------|-------------|
| 200 | GET exitoso |
| 201 | POST creación exitosa |
| 400 | Error de validación / Bad Request |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## 📦 MODELOS DE DATOS

### Schemas en PostgreSQL:
- `cursos` - Curso, Unidad
- `actividades` - Actividad, Entrega, ArchivoEntrega, Comentario, DocumentoActividad
- `evaluaciones` - Rubrica, Criterio, RubricaCriterio, NivelCriterio, Evaluacion, DetalleEvaluacion
- `grupos` - Grupo, MiembroGrupo

---

## 🎓 EJEMPLOS DE FLUJOS COMPLETOS

### Flujo 1: Crear Curso Completo
```bash
# 1. Crear Curso
POST /api/cursos
{
  "nombre_curso": "Programación Avanzada",
  "descripcion": "Curso de algoritmos",
  "estado": "activo",
  "id_usuario": 1
}

# 2. Crear Unidad
POST /api/unidades
{
  "titulo_unidad": "Unidad 1: Ordenamiento",
  "numero_unidad": 1,
  "id_curso": 1
}

# 3. Crear Actividad
POST /api/actividades
{
  "nombre_actividad": "Tarea 1: Quicksort",
  "tipo_actividad": "individual",
  "id_unidad": 1,
  "id_usuario": 1,
  "fecha_limite": "2025-12-31"
}

# 4. Subir Material
POST /api/materiales
{
  "id_actividad": 1,
  "nombre_documento": "Guía Quicksort",
  "tipo_documento": "pdf",
  "url_archivo": "https://..."
}
```

### Flujo 2: Evaluar con Rúbrica
```bash
# 1. Crear Rúbrica
POST /api/rubricas
{
  "nombre_rubrica": "Rúbrica de Código",
  "id_usuario": 1
}

# 2. Obtener entrega
GET /api/entregas/actividad/1

# 3. Crear evaluación
POST /api/evaluaciones
{
  "id_entrega": 1,
  "id_usuario": 1,
  "puntuacion_total": 90,
  "comentarios": "Excelente trabajo",
  "detalles": [...]
}

# 4. Agregar comentario adicional
POST /api/comentarios
{
  "id_entrega": 1,
  "id_usuario": 1,
  "contenido": "Revisa la documentación"
}
```

### Flujo 3: Gestionar Grupos
```bash
# 1. Crear actividad grupal
POST /api/actividades
{
  "nombre_actividad": "Proyecto Final",
  "tipo_actividad": "grupal",
  "id_unidad": 1,
  "id_usuario": 1
}

# 2. Crear grupos
POST /api/grupos
{
  "nombre_grupo": "Grupo A",
  "id_actividad": 1
}

# 3. Agregar miembros
POST /api/grupos/1/miembros
{
  "id_usuario": 10,
  "rol_miembro": "lider"
}

POST /api/grupos/1/miembros
{
  "id_usuario": 11
}
```

---

## 🔐 CONSIDERACIONES DE SEGURIDAD

⚠️ **Actualmente NO implementado:**
- Autenticación JWT
- Validación de roles (RBAC)
- Verificación de permisos por recurso

📝 **Próximos pasos recomendados:**
1. Implementar middleware de autenticación
2. Agregar validación de roles (docente/estudiante)
3. Implementar permisos por recurso
4. Rate limiting
5. Validación de inputs con Joi/Yup

---

## 📊 ESTADÍSTICAS DEL PROYECTO

- **Total de Endpoints**: 62
- **Modelos Sequelize**: 16
- **Controllers**: 9
- **Rutas**: 9
- **Tablas en BD**: 16
- **Schemas**: 4

---

## 🌐 CONFIGURACIÓN DEL SERVIDOR

**Base URL:** `http://localhost:3000`

**Puerto por defecto:** `3000`

**Base de Datos:**
- Host: `dpg-d353crd6ubrc73cru5ag-a.oregon-postgres.render.com`
- Database: `gradiabd`
- Schema principal: `cursos`, `actividades`, `evaluaciones`, `grupos`

---

## 📝 NOTAS IMPORTANTES

1. **Relación Actividades-Grupos**: Solo se pueden crear grupos para actividades tipo `"grupal"`
2. **Eliminación de Grupos**: No se puede eliminar un grupo si tiene entregas asociadas
3. **Materiales**: Están vinculados a **actividades**, no a unidades
4. **Evaluaciones**: Requieren una rúbrica previamente creada
5. **Entregas**: Incluyen estadísticas automáticas de puntualidad

---

## 🎯 COMPLETITUD DEL BACKEND

**Estado:** ✅ **100% Funcional** para el módulo docente core

**Implementado:**
- ✅ Gestión completa de cursos y contenido académico
- ✅ Sistema robusto de evaluación con rúbricas
- ✅ Gestión de grupos para actividades colaborativas
- ✅ Sistema de comentarios para feedback detallado
- ✅ Materiales educativos por actividad
- ✅ Seguimiento de entregas con estadísticas

**Opcional (Fase 2):**
- 👥 Gestión de Estudiantes (inscripción, historial)
- 📧 Sistema de notificaciones
- 📈 Dashboard con analytics avanzados
- 📄 Exportación de reportes (PDF, Excel)
- 🔔 Alertas y recordatorios automáticos

---

**Documentación generada:** 2025-10-10
**Versión del API:** 3.0.0
**Stack:** Node.js + Express.js + Sequelize + PostgreSQL
