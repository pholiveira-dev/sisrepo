const express = require('express');
const userRoutes = express.Router();
const userController = require('../controllers/userController');

userRoutes.get('/', userController.getAll);

userRoutes.get('/:id_user', userController.getId);

// CRIAR A CONTA
userRoutes.post('/', userController.postUser);

// LOGAR NA CONTA
userRoutes.post('/login', userController.loginUser);

userRoutes.put('/users/:id_user', userController.putUser);

module.exports = userRoutes;