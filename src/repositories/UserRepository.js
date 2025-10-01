const UserModel = require('../models/UserModel');

class UserRepository {

    static async findById(id_user) {
        return UserModel.findById(id_user);
    }

    static async findAll() {
        return UserModel.findAll();
    }

    static async create(userData) {
        return UserModel.create(userData);
    }

    static async update(id_user, userData) {
        return UserModel.update(id_user, userData);
    }

    static async delete(id_user) {
        return UserModel.delete(id_user)
    }

    static async findByEmail(email) {
        return UserModel.findByEmail(email);
    }

    static async authenticate(email, password) {
        return UserModel.authenticate(email, password);
    }
}

module.exports = UserRepository;