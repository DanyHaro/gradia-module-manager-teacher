-- ========================================
-- CONSULTAS ÚTILES - SISTEMA DE GESTIÓN DE CURSOS
-- ========================================
-- Este archivo contiene todas las consultas SQL necesarias para
-- diagnóstico, mantenimiento y administración del sistema

-- ========================================
-- 1. DIAGNÓSTICO GENERAL
-- ========================================

-- Ver todos los usuarios
SELECT
    id_usuario,
    estado
FROM mantenimiento_usuarios.usuario
ORDER BY id_usuario;

-- Ver todos los cursos
SELECT
    id_curso,
    nombre_curso,
    descripcion,
    deleted_at,
    CASE
        WHEN deleted_at IS NULL THEN '✅ ACTIVO'
        ELSE '❌ BORRADO'
    END as estado
FROM cursos.curso
ORDER BY id_curso;

-- Ver todas las inscripciones (activas y borradas)
SELECT
    i.id_inscripcion,
    i.id_usuario,
    i.id_curso,
    c.nombre_curso,
    i.created_at,
    i.deleted_at,
    CASE
        WHEN i.deleted_at IS NULL THEN '✅ ACTIVA'
        ELSE '❌ BORRADA'
    END as estado
FROM cursos.inscripcion i
LEFT JOIN cursos.curso c ON i.id_curso = c.id_curso
ORDER BY i.id_usuario, i.id_curso;

-- Contar inscripciones activas por usuario
SELECT
    i.id_usuario,
    COUNT(*) as total_cursos_inscritos
FROM cursos.inscripcion i
WHERE i.deleted_at IS NULL
GROUP BY i.id_usuario
ORDER BY i.id_usuario;

-- Ver unidades de un curso específico (cambiar id_curso)
SELECT
    id_unidad,
    numero_unidad,
    titulo_unidad,
    descripcion,
    deleted_at,
    CASE
        WHEN deleted_at IS NULL THEN '✅ ACTIVA'
        ELSE '❌ BORRADA'
    END as estado
FROM cursos.unidad
WHERE id_curso = 2  -- Cambiar según el curso
ORDER BY numero_unidad;

-- Ver roles de un usuario específico
SELECT
    ur.id_usuario,
    ur.id_rol,
    r.nombre_rol
FROM mantenimiento_usuarios.usuario_rol ur
LEFT JOIN mantenimiento_usuarios.rol r ON ur.id_rol = r.id_rol
WHERE ur.id_usuario = 12;  -- Cambiar según el usuario

-- ========================================
-- 2. INSCRIPCIONES
-- ========================================

-- Inscribir un estudiante en un curso
INSERT INTO cursos.inscripcion (
    id_usuario,
    id_curso,
    created_by,
    updated_by,
    created_at,
    updated_at,
    deleted_at
)
VALUES (
    12,      -- id_usuario (cambiar)
    2,       -- id_curso (cambiar)
    NULL,
    NULL,
    NOW(),
    NOW(),
    NULL     -- NULL = ACTIVA
);

-- Verificar inscripción específica
SELECT
    i.id_inscripcion,
    i.id_usuario,
    i.id_curso,
    c.nombre_curso,
    i.created_at,
    i.deleted_at,
    CASE
        WHEN i.deleted_at IS NULL THEN '✅ ACTIVA'
        ELSE '❌ BORRADA'
    END as estado
FROM cursos.inscripcion i
LEFT JOIN cursos.curso c ON i.id_curso = c.id_curso
WHERE i.id_usuario = 12 AND i.id_curso = 2;  -- Cambiar según necesidad

-- Restaurar inscripción borrada (soft delete)
UPDATE cursos.inscripcion
SET deleted_at = NULL,
    updated_at = NOW()
WHERE id_usuario = 12      -- Cambiar
  AND id_curso = 2;        -- Cambiar

-- Eliminar inscripción (soft delete)
UPDATE cursos.inscripcion
SET deleted_at = NOW(),
    updated_at = NOW()
WHERE id_usuario = 12      -- Cambiar
  AND id_curso = 2;        -- Cambiar

-- Ver todas las inscripciones activas de un usuario
SELECT
    i.id_inscripcion,
    i.id_usuario,
    i.id_curso,
    c.nombre_curso,
    i.created_at
FROM cursos.inscripcion i
INNER JOIN cursos.curso c ON i.id_curso = c.id_curso
WHERE i.id_usuario = 12    -- Cambiar
  AND i.deleted_at IS NULL
ORDER BY c.nombre_curso;

-- ========================================
-- 3. INSCRIPCIÓN DE DOCENTES
-- ========================================

-- Inscribir un docente en un curso
INSERT INTO cursos.inscripcion (
    id_usuario,
    id_curso,
    created_by,
    updated_by,
    created_at,
    updated_at,
    deleted_at
)
VALUES (
    10,      -- id_usuario del docente (cambiar)
    2,       -- id_curso (cambiar)
    NULL,
    NULL,
    NOW(),
    NOW(),
    NULL
);

-- Ver inscripciones de docentes
SELECT
    i.id_inscripcion,
    i.id_usuario,
    i.id_curso,
    c.nombre_curso,
    ur.id_rol,
    r.nombre_rol
FROM cursos.inscripcion i
INNER JOIN cursos.curso c ON i.id_curso = c.id_curso
INNER JOIN mantenimiento_usuarios.usuario_rol ur ON i.id_usuario = ur.id_usuario
INNER JOIN mantenimiento_usuarios.rol r ON ur.id_rol = r.id_rol
WHERE r.nombre_rol = 'DOCENTE'
  AND i.deleted_at IS NULL
ORDER BY i.id_usuario, c.nombre_curso;

-- ========================================
-- 4. UNIDADES/MÓDULOS
-- ========================================

-- Ver última unidad creada de un curso
SELECT
    id_unidad,
    numero_unidad,
    titulo_unidad,
    descripcion,
    created_at
FROM cursos.unidad
WHERE id_curso = 2         -- Cambiar según el curso
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 1;

-- Verificar todas las unidades de un curso
SELECT
    id_unidad,
    numero_unidad,
    titulo_unidad,
    descripcion,
    created_at
FROM cursos.unidad
WHERE id_curso = 2         -- Cambiar
  AND deleted_at IS NULL
ORDER BY numero_unidad;

-- ========================================
-- 5. BÚSQUEDA Y ESTRUCTURA
-- ========================================

-- Buscar tabla inscripcion en todos los esquemas
SELECT
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_name LIKE '%inscripcion%'
ORDER BY table_schema, table_name;

-- Ver estructura de la tabla inscripcion
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'cursos'
  AND table_name = 'inscripcion'
ORDER BY ordinal_position;

-- Ver estructura de la tabla usuario
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'mantenimiento_usuarios'
  AND table_name = 'usuario'
ORDER BY ordinal_position;

-- ========================================
-- 6. DIAGNÓSTICO COMPLETO DE UN USUARIO
-- ========================================

-- Reemplazar '12' con el id_usuario que quieres diagnosticar
DO $$
DECLARE
    v_user_id INTEGER := 12;  -- CAMBIAR AQUÍ
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DIAGNÓSTICO COMPLETO USUARIO: %', v_user_id;
    RAISE NOTICE '========================================';
END $$;

-- Ver inscripciones del usuario
SELECT
    '📚 INSCRIPCIONES' as seccion,
    i.id_inscripcion,
    i.id_curso,
    c.nombre_curso,
    i.deleted_at,
    CASE
        WHEN i.deleted_at IS NULL THEN '✅ ACTIVA'
        ELSE '❌ BORRADA'
    END as estado
FROM cursos.inscripcion i
LEFT JOIN cursos.curso c ON i.id_curso = c.id_curso
WHERE i.id_usuario = 12;  -- Cambiar

-- Ver roles del usuario
SELECT
    '👤 ROLES' as seccion,
    ur.id_usuario,
    ur.id_rol,
    r.nombre_rol
FROM mantenimiento_usuarios.usuario_rol ur
LEFT JOIN mantenimiento_usuarios.rol r ON ur.id_rol = r.id_rol
WHERE ur.id_usuario = 12;  -- Cambiar

-- ========================================
-- 7. LIMPIEZA Y MANTENIMIENTO
-- ========================================

-- Ver inscripciones duplicadas (mismo usuario y curso)
SELECT
    id_usuario,
    id_curso,
    COUNT(*) as total
FROM cursos.inscripcion
WHERE deleted_at IS NULL
GROUP BY id_usuario, id_curso
HAVING COUNT(*) > 1;

-- Eliminar inscripción completamente (hard delete) - ¡CUIDADO!
-- Solo usar si realmente necesitas eliminar físicamente
-- DELETE FROM cursos.inscripcion
-- WHERE id_usuario = ? AND id_curso = ?;

-- ========================================
-- NOTAS IMPORTANTES:
-- ========================================
-- 1. Cambiar los valores de id_usuario e id_curso según necesidad
-- 2. Siempre verificar antes de ejecutar UPDATE o DELETE
-- 3. El sistema usa soft delete (deleted_at), evitar hard delete
-- 4. Después de cambiar inscripciones, el usuario debe hacer logout/login
--    para que el token JWT se actualice con los nuevos cursos
-- ========================================
