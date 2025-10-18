const ReplacementsModel = require('../models/ReplacementsModel');

class ReplacementsRepository {

    static async findById(id_replacement) {
        return ReplacementsModel.findById(id_replacement);
    }

    static async findAll() {
        return ReplacementsModel.findAll();
    }

    static async create(id_user, replacementData) {
        return ReplacementsModel.create(id_user, replacementData);
    }

    static async update(id_replacement, replacementData) {
        return ReplacementsModel.update(id_replacement, replacementData);
    }

    static async delete(id_replacement) {
        return ReplacementsModel.delete(id_replacement);
    }
}

module.exports = ReplacementsRepository;