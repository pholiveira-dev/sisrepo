const express = require('express');
const userRoutes = express.Router();
const userController = require('../controllers/userController');

userRoutes.get('/users', userController.getAll);

userRoutes.get('/users/:id_user', userController.getId);

// CRIAR A CONTA
userRoutes.post('/create', userController.postUser);

// LOGAR NA CONTA
userRoutes.post('/login', userController.loginUser);

userRoutes.put('/users/:id_user', userController.putUser);

module.exports = userRoutes;