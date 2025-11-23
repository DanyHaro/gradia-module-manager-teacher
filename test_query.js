// test_query.js - Script para probar la consulta de entregas
require('dotenv').config();
const sequelize = require('./src/config/database');

// Cargar asociaciones
require('./src/models/associations');

// Cargar modelos
const Entrega = require('./src/models/Entrega');
const Usuario = require('./src/models/Usuario');
const Actividad = require('./src/models/Actividad');
const ArchivoEntrega = require('./src/models/ArchivoEntrega');

async function testQuery() {
    try {
        console.log('🔍 Probando consulta de entregas...');

        const entregas = await Entrega.findAll({
            where: { id_actividad: 8 },
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id_usuario', 'nombre', 'apellidos', 'email', 'foto_perfil']
                },
                {
                    model: Actividad,
                    as: 'actividad',
                    attributes: ['nombre_actividad', 'tipo_actividad', 'fecha_limite']
                },
                {
                    model: ArchivoEntrega,
                    as: 'archivos',
                    attributes: ['nombre_archivo', 'tipo_archivo', 'url_archivo', 'created_at']
                }
            ],
            order: [['fecha_entrega', 'ASC']]
        });

        console.log(`✅ Consulta exitosa! Encontradas ${entregas.length} entregas`);
        console.log(JSON.stringify(entregas, null, 2));

    } catch (error) {
        console.error('❌ Error en la consulta:');
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

testQuery();
