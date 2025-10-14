const SchedulesService = require('../services/SchedulesService');

async function getSchedule(req, res) {
    try {
        const { id_schedule } = req.params;

        const filterSchedule = await SchedulesService.findById(id_schedule);

        if(!filterSchedule) {
            return res.status(404).json({ message: 'Agendamento não encontrado no sistema.' });
        }

        return res.status(200).json(filterSchedule);

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar o agendamento.' });
    }
}

async function getAll(req, res) {
    try {
        const allSchedules = await SchedulesService.findAll();

        return res.status(200).json(allSchedules);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor ao tentar encontrar todos os agendamentos.' });
    }
}

async function postSchedule(req, res) {
    try {

        const id_user  = req.user.id_user ? req.user.id_user : null;
        const { schedule_date, shift, max_capacity } = req.body;

        if(!id_user) {
            return res.status(401).json({ message: 'Usuário não autenticado ou token inválido.' })
        }

        if (!schedule_date || !shift || !max_capacity) {
            return res.status(400).json({ message: 'Todos os campos de agendamento (data, turno e capacidade) são obrigatórios.' });
}

        const scheduleData = { 
            schedule_date: schedule_date, 
            shift: shift, 
            max_capacity: max_capacity,
            created_by_user_id: id_user
    };

        const newSchedule = await SchedulesService.create(scheduleData);

        return res.status(201).json(newSchedule);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor ao criar o agendamento.' });
    }
}

async function putSchedule(req, res) {
    try {

        const  { id_schedule } = req.params;
        const { schedule_date, shift, max_capacity }  = req.body;

        if(!id_schedule) {
            return res.status(404).json({ message: 'id_schedule não informado.' });
        }


        const scheduleData = {  };

        if(schedule_date) scheduleData.schedule_date = schedule_date;
        if(shift) scheduleData.shift = shift;
        if(max_capacity) scheduleData.max_capacity = max_capacity;

        if(Object.keys(scheduleData).length === 0) {
            return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido.' });
        }        

        const update = await SchedulesService.update(id_schedule, scheduleData);

        if(!update) {
            return res.status(404).json({ message:  `Agendamento com ID ${id_schedule} não encontrado para atualização.` });
        }

            return res.status(200).json(update);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor ao atualizar o agendamento.' });
    }
}

async function delSchedule(req, res) {
    try {
        const { id_schedule } = req.params;

        if(!id_schedule) {
            return res.status(400).json({ message: 'Não foi possível encontrar o id_schedule.' });
        }

        const delSchedule = await SchedulesService.delete(id_schedule);

        if(!delSchedule) {
            return res.status(404).json({ message: `Agendamento com ID ${id_schedule} não encontrado para exclusão.` });
        }

        return res.status(200).json(delSchedule);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor ao tentar deletar o agendamento.' });
    }
}

module.exports = {
    getAll,
    getSchedule,    
    postSchedule,
    putSchedule,
    delSchedule
};