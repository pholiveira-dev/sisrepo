const knex = require('../knex');
const TABLE_NAME = 'users';

class UserModel{

    static async findById(id_user) {
        return knex(TABLE_NAME)
        .where({ id_user })
        .first();
    }

    static async findAll() {
        return knex(TABLE_NAME)
        .select(['id_user','name', 'email', 'position']);
    }

    static async create(userData) {
 
        const [newUser] = await knex(TABLE_NAME)
        .insert(userData)
        .returning(['id_user', 'name', 'email', 'position'])
        return newUser;
    }

    static async update(id_user, userData) {

        const [updateUser] = await knex(TABLE_NAME)
        .where({ id_user })
        .update(userData)
        .returning(['id_user', 'name', 'email', 'position'])

        return updateUser;
    }

    static async delete(id_user) {
        return knex(TABLE_NAME).where({ id_user }).del();
    }

    static async findByEmail(email) {
        return knex(TABLE_NAME)
        .where({ email })
        .first()
    }
}

module.exports = UserModel;