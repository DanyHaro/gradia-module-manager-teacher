# 📖 Guía Completa - API de Unidades/Módulos

## 🎯 Información General

La API de unidades permite gestionar los módulos de un curso. Las unidades se guardan en la tabla `cursos.unidad` de PostgreSQL.

**Tabla de Base de Datos:** `cursos.unidad`

**Campos de la Tabla:**
- `id_unidad` (INTEGER) - ID autoincrementable (Primary Key)
- `titulo_unidad` (VARCHAR) - Título del módulo
- `descripcion` (TEXT) - Descripción opcional del módulo
- `numero_unidad` (INTEGER) - Número de orden del módulo
- `id_curso` (INTEGER) - Foreign Key al curso
- `created_at` (TIMESTAMP) - Fecha de creación
- `updated_at` (TIMESTAMP) - Fecha de última actualización

---

## 📋 Endpoints Disponibles

### 1. 📝 Crear Unidad
```http
POST /api/unidades
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "titulo_unidad": "Introducción a la Programación",
  "descripcion": "En este módulo aprenderemos los conceptos básicos de programación",
  "numero_unidad": 1,
  "id_curso": 1
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id_unidad": 5,
    "titulo_unidad": "Introducción a la Programación",
    "descripcion": "En este módulo aprenderemos los conceptos básicos de programación",
    "numero_unidad": 1,
    "id_curso": 1,
    "created_at": "2024-11-17T12:00:00.000Z",
    "updated_at": "2024-11-17T12:00:00.000Z",
    "curso": {
      "nombre_curso": "Desarrollo Web Full Stack"
    }
  },
  "message": "Unidad creada exitosamente"
}
```

**Validaciones:**
- ✅ Requiere autenticación JWT
- ✅ El docente debe estar inscrito en el curso
- ✅ No puede haber dos unidades con el mismo `numero_unidad` en un curso
- ✅ El curso debe existir

**Errores Posibles:**
```json
// 400 - Campos faltantes
{
  "success": false,
  "message": "Los campos titulo_unidad, numero_unidad e id_curso son obligatorios"
}

// 403 - Sin permiso
{
  "success": false,
  "message": "No tienes permiso para crear unidades en este curso. Solo puedes gestionar cursos donde estás inscrito."
}

// 400 - Número duplicado
{
  "success": false,
  "message": "Ya existe una unidad con ese número en el curso"
}

// 404 - Curso no existe
{
  "success": false,
  "message": "El curso especificado no existe"
}
```

---

### 2. 📚 Listar Todas las Unidades
```http
GET /api/unidades
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_unidad": 1,
      "titulo_unidad": "Introducción",
      "descripcion": "Módulo introductorio",
      "numero_unidad": 1,
      "id_curso": 1,
      "created_at": "2024-11-01T10:00:00.000Z",
      "updated_at": "2024-11-01T10:00:00.000Z",
      "curso": {
        "id_curso": 1,
        "nombre_curso": "Desarrollo Web"
      }
    },
    // ... más unidades
  ],
  "message": "Unidades obtenidas exitosamente"
}
```

---

### 3. 🔍 Obtener Unidades de un Curso
```http
GET /api/unidades/curso/:cursoId
Authorization: Bearer <JWT_TOKEN>
```

**Ejemplo:**
```http
GET /api/unidades/curso/1
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_unidad": 1,
      "titulo_unidad": "Módulo 1",
      "numero_unidad": 1,
      "id_curso": 1,
      "curso": {
        "nombre_curso": "Desarrollo Web"
      }
    },
    {
      "id_unidad": 2,
      "titulo_unidad": "Módulo 2",
      "numero_unidad": 2,
      "id_curso": 1,
      "curso": {
        "nombre_curso": "Desarrollo Web"
      }
    }
  ],
  "message": "Unidades del curso obtenidas exitosamente"
}
```

---

### 4. 🔎 Obtener Unidad por ID
```http
GET /api/unidades/:id
Authorization: Bearer <JWT_TOKEN>
```

**Ejemplo:**
```http
GET /api/unidades/5
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id_unidad": 5,
    "titulo_unidad": "Introducción a la Programación",
    "descripcion": "Conceptos básicos",
    "numero_unidad": 1,
    "id_curso": 1,
    "created_at": "2024-11-17T12:00:00.000Z",
    "updated_at": "2024-11-17T12:00:00.000Z",
    "curso": {
      "id_curso": 1,
      "nombre_curso": "Desarrollo Web"
    }
  },
  "message": "Unidad obtenida exitosamente"
}
```

---

### 5. ✏️ Actualizar Unidad
```http
PUT /api/unidades/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "titulo_unidad": "Introducción Actualizada",
  "descripcion": "Nueva descripción",
  "numero_unidad": 1
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id_unidad": 5,
    "titulo_unidad": "Introducción Actualizada",
    "descripcion": "Nueva descripción",
    "numero_unidad": 1,
    "id_curso": 1,
    "updated_at": "2024-11-17T13:00:00.000Z",
    "curso": {
      "nombre_curso": "Desarrollo Web"
    }
  },
  "message": "Unidad actualizada exitosamente"
}
```

---

### 6. 🗑️ Eliminar Unidad
```http
DELETE /api/unidades/:id
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Unidad eliminada exitosamente"
}
```

**⚠️ IMPORTANTE:** Solo se puede eliminar una unidad si **NO tiene actividades asociadas**

**Error si tiene actividades:**
```json
{
  "success": false,
  "message": "No se puede eliminar la unidad porque tiene actividades asociadas. Elimina primero las actividades."
}
```

---

## 💻 Ejemplos de Uso con JavaScript/TypeScript

### Ejemplo 1: Crear Unidad desde el Frontend

```typescript
import { axiosTeacher } from '@/lib/services/config/axiosTeacher';

const crearUnidad = async () => {
  try {
    const response = await axiosTeacher.post('/unidades', {
      titulo_unidad: 'Módulo 1: Introducción',
      descripcion: 'Conceptos básicos de programación',
      numero_unidad: 1,
      id_curso: 1
    });

    console.log('Unidad creada:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error:', error.response?.data?.message);
    throw error;
  }
};
```

### Ejemplo 2: Listar Unidades de un Curso

```typescript
const obtenerUnidadesCurso = async (cursoId: number) => {
  try {
    const response = await axiosTeacher.get(`/unidades/curso/${cursoId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener unidades:', error);
    throw error;
  }
};

// Uso
const unidades = await obtenerUnidadesCurso(1);
console.log('Unidades del curso:', unidades);
```

### Ejemplo 3: Actualizar Unidad

```typescript
const actualizarUnidad = async (id: number, datos: any) => {
  try {
    const response = await axiosTeacher.put(`/unidades/${id}`, datos);
    return response.data.data;
  } catch (error) {
    console.error('Error al actualizar:', error);
    throw error;
  }
};

// Uso
await actualizarUnidad(5, {
  titulo_unidad: 'Módulo 1 Actualizado',
  descripcion: 'Nueva descripción'
});
```

---

## 🗄️ Consultas SQL Útiles

### Verificar Unidades Creadas

```sql
-- Ver todas las unidades con nombre del curso
SELECT
    u.id_unidad,
    u.numero_unidad,
    u.titulo_unidad,
    u.descripcion,
    c.nombre_curso,
    u.created_at
FROM cursos.unidad u
INNER JOIN cursos.curso c ON u.id_curso = c.id_curso
ORDER BY u.id_curso, u.numero_unidad;
```

### Ver Unidades de un Curso Específico

```sql
SELECT * FROM cursos.unidad
WHERE id_curso = 1
ORDER BY numero_unidad;
```

### Contar Unidades por Curso

```sql
SELECT
    c.id_curso,
    c.nombre_curso,
    COUNT(u.id_unidad) as total_unidades
FROM cursos.curso c
LEFT JOIN cursos.unidad u ON c.id_curso = u.id_curso
GROUP BY c.id_curso, c.nombre_curso;
```

### Ver Última Unidad Creada

```sql
SELECT * FROM cursos.unidad
ORDER BY created_at DESC
LIMIT 1;
```

---

## 🔐 Seguridad y Permisos

1. **Autenticación JWT Requerida**
   - Todos los endpoints requieren un token JWT válido
   - El token se envía en el header: `Authorization: Bearer <token>`

2. **Control de Acceso por Inscripción**
   - Solo los docentes **inscritos** en un curso pueden crear/editar/eliminar unidades
   - La inscripción se verifica en la tabla `public.inscripcion`

3. **Validaciones del Backend**
   - ✅ Campos requeridos: `titulo_unidad`, `numero_unidad`, `id_curso`
   - ✅ No permite números de unidad duplicados en el mismo curso
   - ✅ Verifica que el curso existe antes de crear la unidad
   - ✅ No permite eliminar unidades con actividades asociadas

---

## 📊 Flujo de Datos

```
Frontend (gradia-crm)
    ↓
[useSaveUnit Hook]
    ↓
[unitService.ts]
    ↓
[axiosTeacher - JWT incluido]
    ↓
Backend (gradia-module-manager-teacher)
    ↓
[POST /api/unidades]
    ↓
[unidadController.createUnidad]
    ↓
[Validar JWT + Inscripción]
    ↓
[Sequelize Model]
    ↓
PostgreSQL (cursos.unidad)
    ↓
Respuesta con unidad creada
```

---

## ✅ Checklist de Verificación

Para verificar que todo funciona correctamente:

- [ ] El módulo se crea desde el frontend
- [ ] Se guarda en la base de datos (tabla `cursos.unidad`)
- [ ] Aparece en la consulta SQL
- [ ] El API retorna status 201 y los datos completos
- [ ] Se puede listar con `GET /api/unidades/curso/:id`
- [ ] Se puede actualizar con `PUT /api/unidades/:id`
- [ ] Se puede eliminar con `DELETE /api/unidades/:id` (si no tiene actividades)

---

## 🐛 Troubleshooting

**Problema:** Error 403 "No tienes permiso"
- **Solución:** Verificar que el docente esté inscrito en el curso en la tabla `inscripcion`

**Problema:** Error 400 "Ya existe una unidad con ese número"
- **Solución:** Cambiar el `numero_unidad` o verificar las unidades existentes del curso

**Problema:** El módulo no aparece en el frontend después de crearlo
- **Solución:** Verificar que `router.refresh()` se ejecuta en `handleUnitCreated()`

**Problema:** Error de CORS
- **Solución:** Verificar que el backend tenga configurado CORS para el frontend
