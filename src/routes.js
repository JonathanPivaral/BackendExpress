const express = require('express');
const router = express.Router();
const usersController = require('./controllers/usuariosController');

// Rutas de usuarios
router.post('/users', usersController.createUser);
router.post('/login', usersController.loginUser);


module.exports = router;

