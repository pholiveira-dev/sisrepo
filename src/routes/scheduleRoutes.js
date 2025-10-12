const express = require('express');
const router = express.Router();
const schedulesController = require('../controllers/schedulesController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', schedulesController.getAll);

router.get('/:id_schedule', schedulesController.getSchedule)

router.post('/create', 
    authMiddleware,
    roleMiddleware.canCreateStudent,
    schedulesController.postSchedule
);

router.put('/:id_schedule', 
    authMiddleware,
    roleMiddleware.canPutSchedules,
    schedulesController.putSchedule
);

router.delete('/:id_schedule', 
    authMiddleware,
    roleMiddleware.canDeleteSchedules,
    schedulesController.delSchedule
)

module.exports = router;