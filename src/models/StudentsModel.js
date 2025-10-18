const knex = require('../knex');
const TABLE_NAME = 'students';

class StudentsModel {
    static async findById(id_student) {
        return knex(TABLE_NAME)
        .where({ id_student })
        .first();
    } 

    static async findAll() {
        return knex(TABLE_NAME)
        .select(['id_student','email', 'rgm', 'created_by_user_id', 'updated_by_user_id']);
    }

    static async create(studentData, id_user) {

        const [newStudent] = await knex(TABLE_NAME)
        .insert(studentData, id_user)
        .returning(['id_student','email', 'rgm', 'created_by_user_id', 'updated_by_user_id']);
        return newStudent;
    }

    static async update(id_student, id_user, studentData) {
        const [updateStudent] = await knex(TABLE_NAME)
        .where({ id_student })
        .update(studentData)
        .returning(['id_student','email', 'rgm', 'created_by_user_id', 'updated_by_user_id'])
        return updateStudent;
    }

    static async delete(id_student) {
        return knex(TABLE_NAME)
        .where({ id_student })
        .del();
    }

    static async findByEmail(email) {
        return knex(TABLE_NAME)
        .where({ email })
        .first();
    }

    static async findByRGM(rgm) {
        return knex(TABLE_NAME)
        .where({ rgm })
        .first();
    }

    static async findByEmailAndAcessCode(email, access_code) {
        return knex(TABLE_NAME)
        .where({ email, access_code })
        .first();
    }
}

module.exports = StudentsModel;