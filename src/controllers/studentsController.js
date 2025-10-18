const StudentsService = require('../services/StudentsService');

async function getAll(req, res) {
    try {
        const allStudents = await StudentsService.findAll();

        res.status(200).json(allStudents);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servido ao encontrar todos os alunos no banco de dados.' })
    }
}

async function getId(req, res) {
    try {
        const { id_student } = req.params;

        if(!id_student) {
            return res.status(400).json({ message: 'Problema na requisição.' });
        }

        const getStudent = await StudentsService.findById(id_student);

        if(!getStudent) {
            return res.status(404).json({ message: 'O ID do usuário não existe no sistema.' })
        }

        return res.status(200).json(getStudent);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno no servidor ao encontrar o ID do estudante.' });
    }
}

async function postStudent(req, res) {
    try {
        const id_user = req.user.id_user;

        const { name, email, rgm, current_semester } = req.body;

        const rgmString = String(rgm).trim();

        const studentData = { 
            name, 
            email, 
            rgm: rgmString, 
            current_semester };

        const newStudent = await StudentsService.create(studentData, id_user);

        return  res.status(201).json(newStudent); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor ao criar o usuário' });
    }
}

async function putStudent(req, res) {
    try {
        const id_user  = req.user.id_user;
        const {id_student} = req.params;

        if(!id_user) {
            return res.status(400).json({ message: 'ID do usuário não fornecido.' })
        }

        const studentData = {  };

        const { email, rgm } = req.body;

        if(!id_student) {
            return res.status(400).json({ message: 'ID do estudante não fornecido na URL.' })
        }

        if(email) studentData.email = email;
        if(rgm) studentData.rgm = rgm;

        const updatedStudent = await StudentsService.update(id_student, id_user, studentData);

        return res.status(200).json(updatedStudent);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor ao tentar atualizar o estudante.' })
    }
}

async function deleteStudent(req, res) {
    try {
        const {id_student} = req.params;

        const delStudent = await StudentsService.delete(id_student);
        
        return res.status(204).json(delStudent);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno no servidor.' })
    }
}

module.exports = {
    getAll,
    postStudent,
    getId,
    putStudent,
    deleteStudent
}