// Script mejorado para ejecutar la migración de comentarios
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
    console.log('🔄 Ejecutando migración de comentarios...\n');

    // 1. Hacer opcional el campo id_entrega
    console.log('1️⃣ Haciendo opcional id_entrega...');
    try {
      await client.query('ALTER TABLE actividades.comentario ALTER COLUMN id_entrega DROP NOT NULL');
      console.log('✅ id_entrega es ahora opcional');
    } catch (e) {
      console.log('ℹ️ id_entrega ya es opcional o no existe');
    }

    // 2. Añadir id_actividad
    console.log('\n2️⃣ Añadiendo columna id_actividad...');
    try {
      await client.query('ALTER TABLE actividades.comentario ADD COLUMN IF NOT EXISTS id_actividad INTEGER NULL');
      console.log('✅ Columna id_actividad añadida');
    } catch (e) {
      console.log('ℹ️ Columna id_actividad ya existe');
    }

    // 3. Añadir parent_id
    console.log('\n3️⃣ Añadiendo columna parent_id...');
    try {
      await client.query('ALTER TABLE actividades.comentario ADD COLUMN IF NOT EXISTS parent_id INTEGER NULL');
      console.log('✅ Columna parent_id añadida');
    } catch (e) {
      console.log('ℹ️ Columna parent_id ya existe');
    }

    // 4. Añadir foreign key para parent_id
    console.log('\n4️⃣ Añadiendo foreign key para parent_id...');
    try {
      await client.query(`
        ALTER TABLE actividades.comentario
        ADD CONSTRAINT fk_comentario_parent
        FOREIGN KEY (parent_id)
        REFERENCES actividades.comentario(id_comentario)
        ON DELETE CASCADE
      `);
      console.log('✅ Foreign key añadida');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('ℹ️ Foreign key ya existe');
      } else {
        console.log('⚠️ Error al añadir foreign key:', e.message);
      }
    }

    console.log('\n✅ Migración completada exitosamente\n');

    // Verificar las columnas
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'actividades'
        AND table_name = 'comentario'
      ORDER BY ordinal_position
    `);

    console.log('📊 Columnas en la tabla comentario:');
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
