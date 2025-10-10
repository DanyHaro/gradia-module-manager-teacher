// app.js
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./src/config/database');

// 🔧 Importar relaciones ANTES que las rutas
require('./src/models/associations');

// Importar rutas existentes
const cursoRoutes = require('./src/routes/cursoRoutes');
const unidadRoutes = require('./src/routes/unidadRoutes');
const actividadRoutes = require('./src/routes/actividadRoutes');
const entregaRoutes = require('./src/routes/entregaRoutes');

// Importar nuevas rutas de evaluación
const rubricaRoutes = require('./src/routes/rubricaRoutes');
const criterioRoutes = require('./src/routes/criterioRoutes');
const evaluacionRoutes = require('./src/routes/evaluacionRoutes');

// Importar rutas de grupos, comentarios y materiales
const grupoRoutes = require('./src/routes/grupoRoutes');
const comentarioRoutes = require('./src/routes/comentarioRoutes');
const materialRoutes = require('./src/routes/materialRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas principales - Gestión de cursos
app.use('/api/cursos', cursoRoutes);
app.use('/api/unidades', unidadRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/entregas', entregaRoutes);

// Nuevas rutas - Sistema de evaluación
app.use('/api/rubricas', rubricaRoutes);
app.use('/api/criterios', criterioRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);

// Rutas de grupos, comentarios y materiales
app.use('/api/grupos', grupoRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/materiales', materialRoutes);

// Ruta de prueba actualizada
app.get('/', (req, res) => {
    res.json({
        message: 'API de GradIA - Sistema de Gestión Académica para Docentes',
        version: '3.0.0',
        modulos: {
            gestion_cursos: {
                descripcion: 'Gestión completa de cursos, unidades y actividades',
                endpoints: {
                    cursos: '/api/cursos',
                    unidades: '/api/unidades',
                    actividades: '/api/actividades'
                }
            },
            gestion_entregas: {
                descripcion: 'Gestión y seguimiento de entregas de estudiantes',
                endpoints: {
                    entregas: '/api/entregas',
                    estadisticas: '/api/entregas/estadisticas'
                }
            },
            sistema_evaluacion: {
                descripcion: 'Sistema completo de evaluación con rúbricas',
                endpoints: {
                    rubricas: '/api/rubricas',
                    criterios: '/api/criterios',
                    evaluaciones: '/api/evaluaciones'
                }
            }
        },
        funcionalidades: [
            'CRUD completo de cursos y contenido',
            'Gestión de entregas de estudiantes',
            'Sistema de rúbricas y criterios',
            'Evaluación detallada por criterios',
            'Estadísticas y reportes',
            'Feedback automatizado'
        ]
    });
});

// Ruta para verificar la conexión a la base de datos
app.get('/api/health', async (req, res) => {
    try {
        await require('./src/config/database').authenticate();
        res.json({
            status: 'OK',
            database: 'Connected',
            modulos_disponibles: [
                'Gestión de Cursos',
                'Gestión de Entregas', 
                'Sistema de Evaluación'
            ],
            endpoints_totales: 35, // Sin sesiones, arquitectura simplificada
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            database: 'Disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Nueva ruta para obtener resumen de funcionalidades
app.get('/api/resumen', (req, res) => {
    res.json({
        proyecto: 'GradIA - Module Manager Teacher',
        descripcion: 'API backend completa para la gestión académica desde la perspectiva del docente',
        modulos_implementados: {
            gestion_cursos: {
                tablas: ['curso', 'unidad', 'actividad'],
                endpoints: 19,
                estado: 'Completo ✅'
            },
            gestion_entregas: {
                tablas: ['entrega', 'archivo_entrega'],
                endpoints: 8,
                estado: 'Completo ✅'
            },
            sistema_evaluacion: {
                tablas: ['rubrica', 'criterio', 'rubrica_criterio', 'nivel_criterio', 'evaluacion', 'detalle_evaluacion'],
                endpoints: 16,
                estado: 'Recién Implementado 🚀'
            }
        },
        proximos_pasos: [
            'Gestión de grupos para actividades grupales',
            'Sistema de comentarios y feedback',
            'Reportes avanzados y analytics',
            'Integración con IA para feedback automático'
        ],
        tecnologias: ['Node.js', 'Express', 'Sequelize', 'PostgreSQL'],
        base_datos: 'PostgreSQL en Render.com'
    });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        rutas_disponibles: {
            cursos: '/api/cursos',
            unidades: '/api/unidades',
            actividades: '/api/actividades',
            entregas: '/api/entregas',
            rubricas: '/api/rubricas',
            criterios: '/api/criterios',
            evaluaciones: '/api/evaluaciones',
            health: '/api/health',
            resumen: '/api/resumen'
        }
    });
});

// Middleware global para manejo de errores
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
});

// Iniciar servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await testConnection();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
            console.log(`📚 API de GradIA - Module Manager Teacher`);
            console.log(`🔗 Documentación disponible en http://localhost:${PORT}`);
            console.log(`💾 Base de datos: PostgreSQL conectada`);
            console.log(`📊 Módulos disponibles:`);
            console.log(`   ✅ Gestión de Cursos (19 endpoints)`);
            console.log(`   ✅ Gestión de Entregas (8 endpoints)`);
            console.log(`   🚀 Sistema de Evaluación (16 endpoints)`);
            console.log(`📈 Total de endpoints: 43`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;