// Importa Express
const express = require('express');
const app = express();

// Define un puerto
const port = 3000;

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Hola, Mundo!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});