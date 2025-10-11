const knex = require('../knex');
const TABLE_NAME = 'schedules';

class SchedulesModel {
    static async findById(id_schedule) {
        return knex(TABLE_NAME)
        .where({ id_schedule })
        .first();
    }

    static async findAll() {
        return knex(TABLE_NAME)
        .select('id_schedule', 'schedule_date', 'shift', 'max_capacity', 'created_by_user_id');
    }

    static async create(scheduleData) {
        const [ newSchedule ] = await knex(TABLE_NAME)
        .insert(scheduleData)
        .returning('id_schedule', 'schedule_date', 'shift', 'max_capacity', 'created_by_user_id');

        return newSchedule;
    }
    
    static async update(id_schedule, scheduleData) {
        const dataToUpdate = {
            ...scheduleData,
            updated_at: knex.fn.now()
        }

        const [ updateSchedule ] = await knex(TABLE_NAME)
        .where({ id_schedule })
        .update(dataToUpdate)
        .returning('id_schedule', 'schedule_date', 'shift', 'max_capacity', 'created_by_user_id');
        return updateSchedule;
    }
    
    static async delete(id_schedule) {
        return knex(TABLE_NAME)
        .where({ id_schedule })
        .del();
    }    

    static async findByEmail(email) {
        return knex(TABLE_NAME)
        .where({ email })
        .first();
    }

    static async countByDate(schedule_date) {
        const result = await knex(TABLE_NAME)
        .where({ schedule_date })
        .count()
        .first()

        return parseInt(result['count(*)'], 10)
    }

    static async findByDateAndShift(schedule_date, shift) {
        return knex(TABLE_NAME)
        .where({ schedule_date, shift })
        .first();
    }

    static async calculateMaxCapacity(max_capacity) {
        return knex(TABLE_NAME)
        .where({ max_capacity })
    }
}

module.exports = SchedulesModel;