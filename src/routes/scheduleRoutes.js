const express = require('express');
const scheduleRoutes = express.Router();
const schedulesController = require('../controllers/schedulesController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

scheduleRoutes.get('/', schedulesController.getAll);

scheduleRoutes.get('/:id_schedule', schedulesController.getSchedule)

scheduleRoutes.post('/', 
    authMiddleware,
    roleMiddleware.canCreateStudent,
    schedulesController.postSchedule
);

scheduleRoutes.put('/:id_schedule', 
    authMiddleware,
    roleMiddleware.canPutSchedules,
    schedulesController.putSchedule
);

scheduleRoutes.delete('/:id_schedule', 
    authMiddleware,
    roleMiddleware.canDeleteSchedules,
    schedulesController.delSchedule
)

module.exports = scheduleRoutes;