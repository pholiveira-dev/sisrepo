const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcrypt');

// ################### FALTA FAZER VALIDAÇÃO DE SENHA USANDO JOI ######################################

class UserService {
    static async authenticate(email, password) {
        const user = await this.findByEmail(email);

        if(!user) {
            throw new Error('E-mail e/ou senha incorretos.', 401);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            throw new Error('E-mail e/ou senha incorretos.', 401);
        }

        const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
    }

    static async create(userData) {

        const existingUser = await this.findByEmail(userData.email);

        if(existingUser) {
            throw new Error('Este e-mail já está cadastrado.', 409)
        }

        const { password, ...rest } = userData;

        const password_hash = await bcrypt.hash(password, 10);

        const dataToSave = { ...rest, password: password_hash };

        return UserRepository.create(dataToSave);

    }

    static async update(id_user, userData) {
        if(userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return UserRepository.update(id_user, userData);
    }

    static async delete(id_user) {
        return UserRepository.delete(id_user);
    }

    static async findById(id_user) {
        return UserRepository.findById(id_user);
    }

    static async findAll() {
        return UserRepository.findAll();
    }

    static async findByEmail(email) {
        return UserRepository.findByEmail(email);
    }
}

module.exports = UserService;