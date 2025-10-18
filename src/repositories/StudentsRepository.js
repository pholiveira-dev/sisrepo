const StudentsModel = require('../models/StudentsModel');

class StudentsRepository {
    static async findById(id_student) {
        return StudentsModel.findById(id_student);
    }

    static async findAll() {
        return StudentsModel.findAll();
    }

    static async create(studentData, id_user) {
        return StudentsModel.create(studentData, id_user);
    }

    static async update(id_student, id_user, studentData) {
        return StudentsModel.update(id_student, id_user, studentData);
    }

    static async delete(id_student) {
        return StudentsModel.delete(id_student);
    }

    static async findByEmail(email) {
        return StudentsModel.findByEmail(email);
    }

    static async findByRGM(rgm) {
        return StudentsModel.findByRGM(rgm);
    }

    static async findByEmailAndAcessCode(email, acess_code) {
        return StudentsModel.findByEmailAndAcessCode(email, acess_code);
    }
}

module.exports = StudentsRepository;