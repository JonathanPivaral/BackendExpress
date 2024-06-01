
const express = require('express');
const { connectToDatabase } = require('./db');
const routes = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', routes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Reemplaza con el origen de tu frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use((req, res, next) => {
  res.status(404).json({
    message: "El endpoint solicitado no existe."
  });
});

connectToDatabase();



app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));


