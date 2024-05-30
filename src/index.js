const express = require('express');
const { connectToDatabase } = require('./db');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

connectToDatabase();

app.get('/testdb', async (req, res) => {
    try {
      const result = await sql.query `SELECT 1 AS number`;
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send('Error al consultar la base de datos');
    }
  });

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});