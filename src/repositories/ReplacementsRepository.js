const ReplacementsModel = require('../models/ReplacementsModel');

class ReplacementRepository {

    static async findById(id_replacement) {
        return ReplacementsModel.findById(id_replacement);
    }

    static async findAll() {
        return ReplacementsModel.findAll();
    }

    static async create(id_user, replacementData) {
        return ReplacementRepository.create(id_user, replacementData);
    }

    static async update(id_replacement, replacementData) {
        return ReplacementRepository.update(id_replacement, replacementData);
    }

    static async delete(id_replacement) {
        return ReplacementRepository.delete(id_replacement);
    }
}

module.exports = ReplacementRepository;