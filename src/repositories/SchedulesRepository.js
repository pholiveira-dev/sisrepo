const SchedulesModel = require('../models/SchedulesModel');

class SchedulesRepository {
    static async findById(id_schedule) {
        return SchedulesModel.findById(id_schedule);
    }

    static async findAll() {
        return SchedulesModel.findAll();
    }

    static async create(scheduleData) {
        return SchedulesModel.create(scheduleData);
    }

    static async update(id_schedule, scheduleData) {
        return SchedulesModel.update(id_schedule, scheduleData)
    }

    static async delete(id_schedule) {
        return SchedulesModel.delete(id_schedule);
    }
}

module.exports = SchedulesRepository;