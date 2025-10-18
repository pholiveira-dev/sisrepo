const express = require('express');
const studentsRoutes = express.Router();
const studentsController = require('../controllers/studentsController');

// IMPORTANDO OS MIDDLEWARES
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

studentsRoutes.get('/',
    authMiddleware,
    studentsController.getAll
);

studentsRoutes.get('/:id_student', 
    authMiddleware,
    roleMiddleware.canCreateStudent,
    studentsController.getId
)

// ROTA PRIVADA PARA A CRIAÇÃO DO ALUNO
studentsRoutes.post('/',
    authMiddleware,
    roleMiddleware.canCreateStudent,
    studentsController.postStudent
);

studentsRoutes.put('/:id_student',
    authMiddleware,
    roleMiddleware.canCreateStudent,
    studentsController.putStudent
);

studentsRoutes.delete('/:id_student',
    studentsController.deleteStudent
)
module.exports = studentsRoutes;