const sql = require('mssql');

// Configuración de la base de datos
const config = {
  user: 'bancoUser',
  password: '123456789',
  server: 'DESKTOP-2L3IEFE\\SQLEXPRESS01', // Por ejemplo: 'localhost'
  database: 'BancoTransferencias',
  options: {
    encrypt: true, // Usar true si estás usando Azure
    trustServerCertificate: true // Usar true para desarrollo local o servidores sin certificados válidos
  }
};

// Función para conectar a la base de datos
const connectToDatabase = async () => {
  try {
    // Realiza la conexión
    await sql.connect(config);
    console.log('Conexión a la base de datos exitosa');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
};

// Exportar la función de conexión y el objeto sql
module.exports = {
  connectToDatabase,
  sql
};