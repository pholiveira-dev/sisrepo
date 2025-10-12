const knex = require('../knex');
const TABLE_NAME = 'replacements';

class ReplacementsModel {
    static async findById(id_replacement) {
        return knex(TABLE_NAME)
        .where({ id_replacement })
        .first();
    }

    static async findAll() {
        return knex(TABLE_NAME)
        .select('id_replacement', 'justification', 'is_present', 'preceptor_add_by', 'schedule_at');
    }

    static async create(replacementData) {
        const [ newReplacement ] = await knex(TABLE_NAME)
        .insert(replacementData)
        .returning('id_replacement', 'justification', 'is_present', 'preceptor_add_by', 'schedule_at');

        return newReplacement;
    }
    
    static async update(id_replacement, replacementData) {

        const [ updateSchedule ] = await knex(TABLE_NAME)
        .where({ id_replacement })
        .update(replacementData)
        .returning('id_replacement', 'justification', 'is_present', 'preceptor_add_by', 'schedule_at');
        return updateSchedule;
    }
    
    static async delete(id_replacement) {
        return knex(TABLE_NAME)
        .where({ id_replacement })
        .del();
    }        
}

module.exports = ReplacementsModel;