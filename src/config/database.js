// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'dpg-d3r732u3jp1c7393ltdg-a.oregon-postgres.render.com',
  port: 5432,
  database: 'grad_ia_bd',
  username: 'gradia_user',
  password: 'wA1ULtUE7BzIQBD8vL3OL9j1lxXcs0er',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false, // Cambia a console.log para ver las consultas SQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

module.exports = sequelize;
module.exports.testConnection = testConnection;