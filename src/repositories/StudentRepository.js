const StudentModel = require('../models/StudentModel');

class StudentRepository {
    static async findById(id_student) {
        return StudentModel.findById(id_student);
    }

    static async findAll() {
        return StudentModel.findAll();
    }

    static async create(studentData) {
        return StudentModel.create(studentData);
    }

    static async update(id_student, studentData) {
        return StudentModel.update(id_student, studentData);
    }

    static async delete(id_student) {
        return StudentModel.delete(id_student);
    }

    static async findByEmail(email) {
        return StudentModel.findByEmail(email);
    }

    static async findByRGM(rgm) {
        return StudentModel.findByRGM(rgm);
    }

    static async findByEmailAndAcessCode(email, acess_code) {
        return StudentModel.findByEmailAndAcessCode(email, acess_code);
    }
}

module.exports = StudentRepository;