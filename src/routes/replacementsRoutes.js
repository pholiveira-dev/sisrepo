const express = require('express');
const replacementsRoutes = express.Router();

const replacementsController = require('../controllers/replacementsController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

replacementsRoutes.get('/', replacementsController.getAll);

replacementsRoutes.get('/:id_replacement', replacementsController.getById);

replacementsRoutes.post('/', 
    authMiddleware,
    roleMiddleware.canCreateStudent,
    replacementsController.postReplacement
);

replacementsRoutes.put('/:id_replacement', replacementsController.putReplacement);

replacementsRoutes.delete('/:id_replacement', replacementsController.deleteReplacement);

module.exports = replacementsRoutes;