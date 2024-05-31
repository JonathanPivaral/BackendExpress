const express = require('express');
const router = express.Router();
const usersController = require('./controllers/usuariosController');

// Rutas de usuarios
router.post('/users', usersController.createUser);
router.post('/login', usersController.loginUser);
router.post('/deposito', usersController.deposit);
router.post('/retiro', usersController.withdraw);
router.post('/transferencia', usersController.transfer);
router.post('/cuentaBanco', usersController.createBankAccount);

module.exports = router;

