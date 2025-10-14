const ReplacementsService = require('../services/ReplacementsService');

async function getAll (req, res) {
    try {

        const allReplacements = await ReplacementsService.findAll();

        if(!allReplacements && Array.isArray(allReplacements)) {
            return res.status(500).json({ message: 'Erro interno ao buscar o recurso de reposição.' })
        }

        return res.status(200).json(allReplacements);
        
    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: 'Sem registro no sistema.' })
    }
}

async function getById(req, res) {
    try {
        const { id_replacement } = req.params;

        if(!id_replacement) {
            return res.status(404).json({ message: 'ID do agendamento não encontrado.' })
        }

        const findById = await ReplacementsService.findById(id_replacement);

        if(!findById) {
            return res.status(404).json({ message: 'Reposição não encontrada no banco de dados.' })
        }

        return res.status(200).json(findById);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Não foi possível encontrar a reposição.` });
    }
}

async function postReplacement(req, res) {

    try {

    const id_user = req.user.id_user;

    const { student_id, schedule_id, justification, is_present, schedule_at } = req.body;

    if(!id_user || !student_id || !schedule_id || !justification || !schedule_at) {
        return res.status(400).json({ 
            message: 'Todos os campos obrigatórios (ID do estudante, ID do agendamento, justificativa e horário) devem ser preenchidos.' 
        });
    }

    const replacementData = 
    { 
        student_id,
        schedule_id,
        justification, 
        is_present, 
        preceptor_add_by: id_user, 
        schedule_at 
    };

    const newReplacement = await ReplacementsService.create(replacementData);

    return res.status(201).json(newReplacement);

    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: 'Não foi possível criar o agendamento.' })
    }
}

async function putReplacement (req, res) {
    try {
        const { id_replacement } = req.params;
        const { student_id, schedule_id, justification, is_present, schedule_at } = req.body;

        if(!id_replacement) {
            return res.status(400).json({ message: 'ID da reposição é obrigatório.' })
        }

        const replacementData = { };

        if(student_id) replacementData.student_id = student_id;
        if(schedule_id) replacementData.schedule_id = schedule_id;
        if(justification) replacementData.justification = justification;
        if(is_present) replacementData.is_present = is_present;
        if(schedule_at) replacementData.schedule_at = schedule_at;

        const updateReplacement = await ReplacementsService.update(id_replacement, replacementData);

        if(!updateReplacement) {
            return res.status(404).json({ message: `Agendamento com ID ${id_replacement} não encontrado para atualização.` })
        }

        return res.status(200).json(updateReplacement);

    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: 'Erro ao atualizar o agendamento.' })
    }
}

async function deleteReplacement(req, res) {
    try {

        const { id_replacement } = req.params;

        if(!id_replacement) {
            return res.status(400).json({ message: 'ID do agendamento não encontrado.' });
        }

        const delReplacement = await ReplacementsService.delete(id_replacement);

        if(!delReplacement) {
            return res.status(404).json({ message: 'Não foi possível excluir o agendamento.' })
        }

        return res.status(200).json(delReplacement);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor.' })
    }
}

module.exports = {
    getAll,
    getById,
    postReplacement,
    putReplacement,
    deleteReplacement
}