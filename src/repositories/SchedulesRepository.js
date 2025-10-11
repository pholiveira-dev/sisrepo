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

    static async findByEmail(email) {
        return SchedulesModel.findByEmail(email);
    }

    static async countByDate(schedule_date) {
        return SchedulesModel.countByDate(schedule_date);
    }

    static async findByDateAndShift(schedule_date, shift) {
        return SchedulesModel.findByDateAndShift(schedule_date, shift)
    }

    static async calculateMaxCapacity(max_capacity) {
        return SchedulesModel.calculateMaxCapacity(max_capacity);
    }
}

module.exports = SchedulesRepository;