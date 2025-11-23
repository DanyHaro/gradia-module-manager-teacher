require('dotenv').config();
const { Inscripcion, Usuario, Persona, Curso, Actividad, Unidad } = require('./src/models/associations');
const sequelize = require('./src/config/database');

async function testQuery() {
    try {
        console.log('Probando conexión...');
        await sequelize.authenticate();
        console.log('Conexión exitosa.');

        const actividadId = 6; // ID problemático mencionado por el usuario

        console.log(`\n--- Buscando Actividad ${actividadId} ---`);
        const actividad = await Actividad.findByPk(actividadId, {
            include: [{
                model: Unidad,
                as: 'unidad',
                include: [{
                    model: Curso,
                    as: 'curso'
                }]
            }]
        });

        if (!actividad) {
            console.error('Actividad no encontrada');
            return;
        }

        console.log('Actividad encontrada:', actividad.nombre_actividad);
        console.log('Unidad:', actividad.unidad?.titulo_unidad);
        console.log('Curso:', actividad.unidad?.curso?.nombre_curso);
        console.log('ID Curso:', actividad.unidad?.curso?.id_curso);

        const cursoId = actividad.unidad?.curso?.id_curso;

        if (!cursoId) {
            console.error('No se pudo obtener el ID del curso');
            return;
        }

        console.log(`\n--- Buscando Inscripciones para Curso ${cursoId} ---`);
        const inscripciones = await Inscripcion.findAll({
            where: { id_curso: cursoId },
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['id_usuario', 'correo_institucional'],
                include: [{
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'apellido']
                }]
            }]
        });

        console.log(`Inscripciones encontradas: ${inscripciones.length}`);
        inscripciones.forEach(ins => {
            console.log(`- Inscripcion ID: ${ins.id_inscripcion}, Usuario ID: ${ins.id_usuario}`);
            console.log(`  Usuario: ${JSON.stringify(ins.usuario)}`);
        });

        console.log(`\n--- Buscando Entregas para Actividad ${actividadId} ---`);
        const { Entrega } = require('./src/models/associations');
        const entregas = await Entrega.findAll({
            where: { id_actividad: actividadId }
        });
        console.log(`Entregas encontradas: ${entregas.length}`);
        entregas.forEach(e => {
            console.log(`- Entrega ID: ${e.id_entrega}, Usuario ID: ${e.id_usuario}`);
        });

        console.log(`\n--- Verificando Cruce ---`);
        inscripciones.forEach(ins => {
            const entrega = entregas.find(e => e.id_usuario === ins.id_usuario);
            console.log(`Usuario ${ins.id_usuario} (${ins.usuario?.persona?.nombre}): ${entrega ? 'TIENE entrega' : 'NO tiene entrega'}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

testQuery();
