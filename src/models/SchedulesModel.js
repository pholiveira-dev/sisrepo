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
        const { newSchedule } = await knex(TABLE_NAME)
        .insert(scheduleData)
        .returning('id_schedule', 'schedule_date', 'shift', 'max_capacity', 'created_by_user_id');

        return newSchedule;
    }
    
    static async update(id_schedule, scheduleData) {
        const { updateSchedule } = await knex(TABLE_NAME)
        .where({ id_schedule })
        .update(scheduleData)
        .returning('id_schedule', 'schedule_date', 'shift', 'max_capacity', 'created_by_user_id');
        return updateSchedule;
    }
    
    static async delete(id_schedule) {
        return knex(TABLE_NAME)
        .where({ id_schedule })
        .del();
    }    
}

module.exports = SchedulesModel;