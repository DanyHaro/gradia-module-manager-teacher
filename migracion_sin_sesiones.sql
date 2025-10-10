-- ========================================
-- MIGRACIÓN: ELIMINAR MÓDULO SESIONES
-- GradIA - Module Manager Teacher
-- ========================================
-- Objetivo: Cambiar la jerarquía de CURSO → UNIDAD → SESIÓN → ACTIVIDAD
--           a CURSO → UNIDAD → ACTIVIDAD (eliminando Sesión)
-- ========================================

-- PASO 1: Agregar columna temporal id_unidad a la tabla actividad
ALTER TABLE actividades.actividad
ADD COLUMN IF NOT EXISTS id_unidad INTEGER;

-- PASO 2: Migrar datos - Asignar id_unidad basado en la sesión actual
-- Cada actividad heredará el id_unidad de su sesión padre
UPDATE actividades.actividad AS act
SET id_unidad = ses.id_unidad
FROM cursos.sesion AS ses
WHERE act.id_sesion = ses.id_sesion;

-- PASO 3: Verificar que todas las actividades tengan id_unidad asignado
-- (Este query debe retornar 0 registros si la migración fue exitosa)
SELECT COUNT(*) as actividades_sin_unidad
FROM actividades.actividad
WHERE id_unidad IS NULL;

-- PASO 4: Hacer id_unidad NOT NULL y agregar constraint de foreign key
ALTER TABLE actividades.actividad
ALTER COLUMN id_unidad SET NOT NULL;

ALTER TABLE actividades.actividad
ADD CONSTRAINT fk_actividad_unidad
FOREIGN KEY (id_unidad) REFERENCES cursos.unidad(id_unidad)
ON DELETE CASCADE;

-- PASO 5: Crear índice para mejorar performance en consultas por unidad
CREATE INDEX IF NOT EXISTS idx_actividad_id_unidad
ON actividades.actividad(id_unidad);

-- PASO 6: Eliminar foreign key constraint antigua de sesión
ALTER TABLE actividades.actividad
DROP CONSTRAINT IF EXISTS actividad_id_sesion_fkey;

-- PASO 7: Eliminar columna id_sesion de la tabla actividad
ALTER TABLE actividades.actividad
DROP COLUMN IF EXISTS id_sesion;

-- ========================================
-- OPCIONAL: ELIMINAR TABLA SESION
-- ========================================
-- ⚠️ ADVERTENCIA: Solo ejecutar estos pasos si estás 100% seguro
-- que no hay otros sistemas o módulos que dependan de la tabla sesion

-- Verificar si hay otras tablas que referencian a sesion
-- (Este query te mostrará todas las foreign keys que apuntan a sesion)
SELECT
    tc.table_schema,
    tc.table_name,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND kcu.table_schema = 'cursos'
  AND kcu.column_name LIKE '%sesion%';

-- Si no hay dependencias, puedes eliminar la tabla sesion
-- DROP TABLE IF EXISTS cursos.sesion CASCADE;

-- ========================================
-- VERIFICACIONES POST-MIGRACIÓN
-- ========================================

-- 1. Verificar estructura de la tabla actividad
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'actividades'
  AND table_name = 'actividad'
ORDER BY ordinal_position;

-- 2. Contar actividades por unidad
SELECT
    u.id_unidad,
    u.titulo_unidad,
    COUNT(a.id_actividad) as total_actividades
FROM cursos.unidad u
LEFT JOIN actividades.actividad a ON u.id_unidad = a.id_unidad
GROUP BY u.id_unidad, u.titulo_unidad
ORDER BY u.id_unidad;

-- 3. Verificar foreign keys activas en actividad
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'actividades'
  AND tc.table_name = 'actividad'
  AND tc.constraint_type = 'FOREIGN KEY';

-- ========================================
-- ROLLBACK (Solo en caso de emergencia)
-- ========================================
-- Si algo sale mal, puedes restaurar la columna id_sesion
-- PERO necesitarás tener un backup de los datos originales

/*
-- Restaurar columna id_sesion
ALTER TABLE actividades.actividad
ADD COLUMN id_sesion INTEGER;

-- Restaurar foreign key (solo si la tabla sesion aún existe)
ALTER TABLE actividades.actividad
ADD CONSTRAINT actividad_id_sesion_fkey
FOREIGN KEY (id_sesion) REFERENCES cursos.sesion(id_sesion);

-- Necesitarás restaurar los datos desde un backup
-- RESTORE FROM BACKUP...
*/

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================
-- 1. Ejecutar este script en un entorno de prueba primero
-- 2. Hacer backup completo de la base de datos antes de ejecutar
-- 3. Los datos de sesiones NO se eliminan automáticamente
-- 4. Verificar que todas las verificaciones post-migración sean exitosas
-- 5. Probar todos los endpoints de la API después de la migración
