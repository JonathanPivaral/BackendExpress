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


// Deposito de cuenta

const deposit = async (req, res) => {
    try {
      const { numeroCuenta, monto, descripcion } = req.body;
  
      await connectToDatabase();
  
      const cuentaCheck = await sql.query`SELECT 1 FROM CuentasBancarias WHERE NumeroCuenta = ${numeroCuenta}`;
  
      if (cuentaCheck.recordset.length === 0) {
        return res.status(404).json({ error: 'Cuenta no encontrada' });
      }
  
      const result = await sql.query`
        EXEC Deposito @numeroCuenta = ${numeroCuenta}, @monto = ${monto}, @descripcion = ${descripcion}`;
  
      res.status(200).json({ message: 'Depósito realizado con éxito' });
    } catch (err) {
      console.error("Error al realizar depósito:", err);
      res.status(500).json({ error: err.message });
    }
  };

// Retiro de cuenta

const withdraw = async (req, res) => {
    try {
      const { numeroCuenta, monto, descripcion } = req.body;
  
      await connectToDatabase();
  
      const cuentaCheck = await sql.query`SELECT 1 FROM CuentasBancarias WHERE NumeroCuenta = ${numeroCuenta}`;
  
      if (cuentaCheck.recordset.length === 0) {
        return res.status(404).json({ error: 'Cuenta no encontrada' });
      }
  
      const result = await sql.query`
        EXEC Retiro @numeroCuenta = ${numeroCuenta}, @monto = ${monto}, @descripcion = ${descripcion}`;
  
      res.status(200).json({ message: 'Retiro realizado con éxito' });
    } catch (err) {
      console.error("Error al realizar retiro:", err);
      res.status(500).json({ error: err.message });
    }
  };
  

// Transferencias

const transfer = async (req, res) => {
    try {
      const { cuentaOrigen, cuentaDestino, monto, descripcion } = req.body;
  
      await connectToDatabase();
  
      const origenCheck = await sql.query`SELECT 1 FROM CuentasBancarias WHERE NumeroCuenta = ${cuentaOrigen}`;
      const destinoCheck = await sql.query`SELECT 1 FROM CuentasBancarias WHERE NumeroCuenta = ${cuentaDestino}`;
  
      if (origenCheck.recordset.length === 0 || destinoCheck.recordset.length === 0) {
        return res.status(404).json({ error: 'Cuenta origen o destino no encontrada' });
      }
  
      const result = await sql.query`
        EXEC Transferencia @cuentaOrigen = ${cuentaOrigen}, @cuentaDestino = ${cuentaDestino}, @monto = ${monto}, @descripcion = ${descripcion}`;
  
      res.status(200).json({ message: 'Transferencia realizada con éxito' });
    } catch (err) {
      console.error("Error al realizar transferencia:", err);
      res.status(500).json({ error: err.message });
    }
  };

//cuenta bancaria

const createBankAccount = async (req, res) => {
    try {
      const { usuarioID, numeroCuenta, saldoInicial = 0 } = req.body;
  
      await connectToDatabase();
  
      // Verificar si el usuario existe
      const userCheck = await sql.query`SELECT 1 FROM Usuarios WHERE UsuarioID = ${usuarioID}`;
  
      if (userCheck.recordset.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Crear la cuenta bancaria
      const result = await sql.query`
        INSERT INTO CuentasBancarias (UsuarioID, NumeroCuenta, Saldo)
        OUTPUT INSERTED.CuentaID
        VALUES (${usuarioID}, ${numeroCuenta}, ${saldoInicial})`;
  
      if (result.recordset.length === 0) {
        return res.status(500).json({ error: 'No se pudo crear la cuenta bancaria' });
      }
  
      res.status(201).json({ message: 'Cuenta bancaria creada', cuentaID: result.recordset[0].CuentaID });
    } catch (err) {
      console.error("Error al crear cuenta bancaria:", err);
      res.status(500).json({ error: err.message });
    }
  };

module.exports = {
  createUser,
  loginUser,
  deposit,
  withdraw,
  transfer,
  createBankAccount
};
