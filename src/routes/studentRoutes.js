const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');

// IMPORTANDO OS MIDDLEWARES
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// ROTA PRIVADA PARA A CRIAÇÃO DO ALUNO

router.post('/',
    authMiddleware,
    roleMiddleware.canCreateStudent,
    StudentController.postStudent
);

router.get('/',
    authMiddleware,
    StudentController.getAll
)

module.exports = router;