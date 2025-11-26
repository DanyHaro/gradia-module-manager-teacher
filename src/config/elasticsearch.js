const { Client } = require("@elastic/elasticsearch");

const es = new Client({
  node: process.env.ES_NODE, // https://3.137.198.178:9200/
  auth: {
    apiKey: process.env.ES_API_KEY,
  },
  tls: {
    rejectUnauthorized: false, // solo para desarrollo si ES no tiene SSL válido
  }
});

// Verificar conexión
const checkConnection = async () => {
  try {
    const health = await es.cluster.health();
    console.log('✅ Elasticsearch conectado:', health.cluster_name);
    return true;
  } catch (error) {
    console.error('❌ Error conectando a Elasticsearch:', error.message);
    return false;
  }
};

module.exports = { es, checkConnection };