const StudentRepository = require('../repositories/StudentRepository');
const bcrypt = require('bcrypt');

class StudentService {

    static async create(studentData) {
        return StudentRepository.create(userData);

    }

    static async update(id_student, studentData) {
        return StudentRepository.update(id_student, studentData)
    }

    static async delete(id_student) {
        return StudentRepository.delete(id_student);
    }

    static async findById(id_student) {
        return StudentRepository.findById(id_student);
    }

    static async findAll() {
        return StudentRepository.findAll();
    }

    static async findByEmail(email) {
        return StudentRepository.findByEmail(email);
    }

    static async findByRGM(rgm) {
        return StudentRepository.findByRGM(rgm);
    }
}

module.exports = StudentService;