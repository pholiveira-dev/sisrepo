const StudentService = require('../services/StudentService');

async function getAll(req, res) {
    try {
        const allStudents = await StudentService.findAll();

        res.status(200).json(allStudents);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Não foi possível buscar todos os alunos.' })
    }
}

async function postStudent(req, res) {
    try {
        const creatorId = req.user.id;
        const creatorPosition = req.user.position;

        const { name, email, rgm, current_semester } = req.body;

        const studentData = { name, email, rgm, current_semester };

        const newStudent = await StudentService.create(studentData, creatorId, creatorPosition);

        return  res.status(200).json(newStudent); 

    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Não foi possível criar o usuário.' })
    }
}

module.exports = {
    getAll,
    postStudent,
}