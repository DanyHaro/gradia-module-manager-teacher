// app.js
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./src/config/database');

// 🔧 Importar relaciones ANTES que las rutas
require('./src/models/associations');

// Importar rutas
const cursoRoutes = require('./src/routes/cursoRoutes');
const unidadRoutes = require('./src/routes/unidadRoutes');
const sesionRoutes = require('./src/routes/sesionRoutes');
const actividadRoutes = require('./src/routes/actividadRoutes'); // Nueva ruta

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

// Rutas principales
app.use('/api/cursos', cursoRoutes);
app.use('/api/unidades', unidadRoutes);
app.use('/api/sesiones', sesionRoutes);
app.use('/api/actividades', actividadRoutes); // Nueva ruta

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de GradIA - Gestión de Cursos, Unidades y Sesiones',
    version: '1.0.0',
    endpoints: {
      cursos: '/api/cursos',
      unidades: '/api/unidades',
      sesiones: '/api/sesiones' // Nuevo endpoint
    }
  });
});

// Ruta para verificar la conexión a la base de datos
app.get('/api/health', async (req, res) => {
  try {
    await require('./src/config/database').authenticate();
    res.json({
      status: 'OK',
      database: 'Connected',
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

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
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
      console.log(` Servidor corriendo en el puerto ${PORT}`);
      console.log(` Documentación disponible en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;