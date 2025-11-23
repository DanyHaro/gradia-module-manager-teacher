// Script para ejecutar la migración de calificación
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('🔄 Ejecutando migración...');

    // Añadir campo de calificación
    await client.query(`
      ALTER TABLE actividades.entrega
      ADD COLUMN IF NOT EXISTS calificacion NUMERIC(5,2) NULL
    `);
    console.log('✅ Campo calificacion añadido');

    // Añadir campo de retroalimentación
    await client.query(`
      ALTER TABLE actividades.entrega
      ADD COLUMN IF NOT EXISTS retroalimentacion TEXT NULL
    `);
    console.log('✅ Campo retroalimentacion añadido');

    // Añadir comentarios
    await client.query(`
      COMMENT ON COLUMN actividades.entrega.calificacion IS 'Calificación numérica de la entrega (0-20)'
    `);

    await client.query(`
      COMMENT ON COLUMN actividades.entrega.retroalimentacion IS 'Comentarios y retroalimentación del docente'
    `);
    console.log('✅ Comentarios añadidos');

    // Verificar los campos
    const result = await client.query(`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'actividades'
        AND table_name = 'entrega'
        AND column_name IN ('calificacion', 'retroalimentacion')
    `);

    console.log('\n📋 Campos creados:');
    console.table(result.rows);

    console.log('\n🎉 Migración completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
