const StudentsRepository = require('../repositories/StudentsRepository');

class StudentsService {

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

    static async create(studentData, id_user) {

        const rgm = studentData.rgm;

        const rgmString = String(rgm)

        if(!rgm || typeof rgm !== 'string') {
            throw new Error('O RGM é obrigatório e deve ser uma string.')
        }

        const access_code = rgmString.slice(-4);

        const existingStudent = await this.findByRGM(studentData.rgm);

        if (existingStudent) {
            throw new Error('Esse RGM já está cadastrado na nossa base de dados.')
        }

        const dataStudent = {
            name: studentData.name,
            email: studentData.email,
            rgm: rgm,
            current_semester: studentData.current_semester,
            access_code: access_code,
            created_by_user_id: id_user,
            updated_by_user_id: id_user
        }

        const newStudent = await StudentsRepository.create(dataStudent, id_user);

        return newStudent;

    }

    static async update(id_student, id_user, studentData) {

        const rgm = studentData.rgm;

        const rgmString = String(rgm)

        const access_code = rgmString.slice(-4);

        const dataToUpdate = {
            ...studentData,
            access_code: access_code,
            updated_by_user_id: id_user
        }

        return StudentsRepository.update(id_student, id_user, dataToUpdate);
    }

    static async delete(id_student) {
        return StudentsRepository.delete(id_student);
    }

    static async findById(id_student) {
        return StudentsRepository.findById(id_student);
    }

    static async findAll() {
        return StudentsRepository.findAll();
    }

    static async findByEmail(email) {
        return StudentsRepository.findByEmail(email);
    }

    static async findByRGM(rgm) {
        return StudentsRepository.findByRGM(rgm);
    }
}

module.exports = StudentsService;