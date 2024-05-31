const { sql, connectToDatabase } = require('../db');
const bcrypt = require('bcrypt');

// Crear usuario
const createUser = async (req, res) => {
  try {
    console.log("Solicitud para crear usuario recibida"); // Depuración
    const { Nombre, Apellido, Email, Password } = req.body;
    console.log(`Datos recibidos: ${Nombre}, ${Apellido}, ${Email}`); // Depuración
    const hashedPassword = await bcrypt.hash(Password, 10);
    await connectToDatabase();
    const result = await sql.query`INSERT INTO Usuarios (Nombre, Apellido, Email, Password)
      OUTPUT INSERTED.UsuarioID
      VALUES (${Nombre}, ${Apellido}, ${Email}, ${hashedPassword})`;

    console.log("Resultado de la inserción:", result); // Depuración
    if (result.recordset.length === 0) {
      return res.status(500).json({ error: 'No se pudo crear el usuario.' });
    }
    res.status(201).json({ message: 'Usuario creado', userId: result.recordset[0].UsuarioID });
  } catch (err) {
    console.error("Error al crear usuario:", err); // Depuración
    res.status(500).json({ error: err.message });
  }
};


// Login de usuario
const loginUser = async (req, res) => {
  try {
    console.log("Solicitud de login recibida"); // Depuración
    const { Email, Password } = req.body;
    await connectToDatabase();
    const result = await sql.query`SELECT * FROM Usuarios WHERE Email = ${Email}`;
    console.log("Resultado de la búsqueda:", result); // Depuración
    if (result.recordset.length === 0) {
      console.log("Usuario no encontrado"); // Depuración
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    const user = result.recordset[0];
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      console.log("Contraseña incorrecta"); // Depuración
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }
    res.status(200).json({ message: 'Login exitoso', userId: user.UsuarioID });
  } catch (err) {
    console.error("Error en el login:", err); // Depuración
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createUser,
  loginUser
};
