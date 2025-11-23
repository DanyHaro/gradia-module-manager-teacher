// Script para ejecutar la migración de comentarios
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
    console.log('🔄 Ejecutando migración de comentarios...');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'MIGRATION_ADD_ACTIVIDAD_PARENT_TO_COMENTARIO.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Ejecutar cada comando SQL (excluyendo comentarios y verificación)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && !cmd.startsWith('/*') && !cmd.toUpperCase().startsWith('COMMENT') && !cmd.toUpperCase().startsWith('SELECT'));

    for (const command of commands) {
      if (command) {
        console.log(`Ejecutando: ${command.substring(0, 80)}...`);
        await client.query(command);
      }
    }

    console.log('✅ Migración completada exitosamente');

    // Verificar las columnas
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'actividades'
        AND table_name = 'comentario'
        AND column_name IN ('id_actividad', 'parent_id', 'id_entrega')
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Columnas en la tabla comentario:');
    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error al ejecutar la migración:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration()
  .then(() => {
    console.log('\n✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
