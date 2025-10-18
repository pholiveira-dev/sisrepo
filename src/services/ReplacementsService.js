const ReplacementsRepository = require('../repositories/ReplacementsRepository');

class ReplacementService {
    
    static async findById(id_replacement) {
        return ReplacementsRepository.findById(id_replacement);
    }

    static async findAll() {
        return ReplacementsRepository.findAll();
    }

    static async create(replacementData) {
        return ReplacementsRepository.create(replacementData);
    }

    static async update(id_replacement, replacementData) {
        return ReplacementsRepository.update(id_replacement, replacementData);
    }

    static async delete(id_replacement) {
        return ReplacementsRepository.delete(id_replacement);
    }
}

module.exports = ReplacementService;