const express = require('express');
const studentRoutes = express.Router();
const StudentController = require('../controllers/studentController');

// IMPORTANDO OS MIDDLEWARES
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// ADICIONADA AGORA PARA TESTAR COM FRONT END
studentRoutes.get('/create',
    authMiddleware,
    roleMiddleware.canCreateStudent,
    (req, res) => {
        res.render('cadastrarAluno', { message: null, isSuccess: false });
    }
);

// ROTA PRIVADA PARA A CRIAÇÃO DO ALUNO
studentRoutes.post('/',
    authMiddleware,
    roleMiddleware.canCreateStudent,
    StudentController.postStudent
);

studentRoutes.get('/',
    authMiddleware,
    StudentController.getAll
);


module.exports = studentRoutes;