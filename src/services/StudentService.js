const StudentRepository = require('../repositories/StudentRepository');
const bcrypt = require('bcrypt');

class StudentService {

    static async autenticate(rgm, access_code) {

        const student = await this.findByRGM(rgm);

        if(!student) {
            throw new Error('RGM incorreto!');
        }

        const expectedAccessCode = student.rgm.slice(-4);

        if(access_code !== expectedAccessCode) {
            throw new Error('O código de acesso não bate com o seu RGM.')
        }

        return student;
    }

    static async create(studentData, creatorId) {

        const access_code = studentData.rgm.slice(-4)

        const existingStudent = await this.findByRGM(studentData.rgm);

        if (existingStudent) {
            throw new Error('Esse RGM já está cadastrado na nossa base de dados.')
        }

        const dataStudent = {
            name: studentData.name,
            email: studentData.email,
            rgm: studentData.rgm,
            current_semester: studentData.current_semester,
            access_code: access_code,
            preceptor_user_id: studentData.preceptor_user_id,
            created_by_user_id: creatorId,
            updated_by_user_id: creatorId
        }

        const newStudent = await StudentRepository.create(dataStudent);

        return newStudent;

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