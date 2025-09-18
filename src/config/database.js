// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'dpg-d353crd6ubrc73cru5ag-a.oregon-postgres.render.com',
  port: 5432,
  database: 'gradiabd',
  username: 'gradiabd_user',
  password: 'O9brCLqxzeGOiV73JfJOXH8u6Y71lze7',
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