
const express = require('express');
const { connectToDatabase } = require('./db');
const routes = require('./routes');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', routes);


app.use((req, res, next) => {
  res.status(404).json({
    message: "El endpoint solicitado no existe."
  });
});

connectToDatabase();



app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));


