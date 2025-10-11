const SchedulesService = require('../services/SchedulesService');

async function getSchedule(req, res) {
    try {
        const { id_schedule } = req.params;

        const filterSchedule = await SchedulesService.findById(id_schedule)

        return res.status(200).json(filterSchedule);

    } catch (error) {
        console.error(error)
        return res.status(404).json({ message: 'Reposição não encontrada no sistema.' })
    }
}

async function getAll(req, res) {
    try {
        const allSchedules = await SchedulesService.findAll();

        return res.status(200).json(allSchedules);

    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: 'Erro ao encontrar as reposições.' });
    }
}

async function postSchedule(req, res) {
    try {

        const id_user  = req.user.id_user
        const { schedule_date, shift, max_capacity } = req.body;

        const scheduleData = { 
            schedule_date: schedule_date, 
            shift: shift, 
            max_capacity: max_capacity,
            created_by_user_id: id_user
    };

        const newSchedule = await SchedulesService.create(scheduleData);

        return res.status(200).json(newSchedule);

    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: 'Não foi possível criar a reposição.' });
    }
}

async function putSchedule(req, res) {
    try {

        const  { id_schedule } = req.params;
        const { schedule_date, shift, max_capacity }  = req.body;

        const scheduleData = {  };

        if(!id_schedule) {
            return res.status(400).json({ message: 'id_schedule não informado.' })
        }

        if(schedule_date) scheduleData.schedule_date = schedule_date;
        if(shift) scheduleData.shift = shift;
        if(max_capacity) scheduleData.max_capacity = max_capacity;

        if(Object.keys(scheduleData).length === 0) {
            return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido.' })
        }        

        const update = await SchedulesService.update(id_schedule, scheduleData);

            return res.status(200).json(update);
        
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Não foi possível atualizar os dados da reposição.' })
    }
}

async function delSchedule(req, res) {
    try {
        const { id_schedule } = req.params;

        if(!id_schedule) {
            return res.status(400).json({ message: 'Não foi possível encontrar o id_schedule.' })
        }

        const delSchedule = await SchedulesService.delete(id_schedule);

        return res.status(200).json(delSchedule)
    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: 'Não foi possível deletar a reposição.' })
    }
}

module.exports = {
    getAll,
    getSchedule,    
    postSchedule,
    putSchedule,
    delSchedule
};