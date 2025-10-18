const SchedlesRepository = require('../repositories/SchedulesRepository');

class SchedulesService {

    static async create(scheduleData) {

        const { schedule_date, shift } = scheduleData;
        
        const existingSchedule = await SchedlesRepository.findByDateAndShift(schedule_date, shift);

        if(existingSchedule) {
            throw new Error('Já existe agendamento para este turno nesta data.')
        }

        const countDate = await SchedlesRepository.countByDate(schedule_date);

        if(countDate >= 3) {
            throw new Error('O limite máximo de 3 agendamentos para esta data foi atingido')
        }

        return SchedlesRepository.create(scheduleData);
    }

    static async update(id_schedule, scheduleData) {
        return SchedlesRepository.update(id_schedule, scheduleData)
    }

    static async delete(id_schedule) {
        return SchedlesRepository.delete(id_schedule);
    }

    static async findById(id_schedule) {
        return SchedlesRepository.findById(id_schedule);
    }

    static async findAll() {
        return SchedlesRepository.findAll();
    }

    static async findByEmail(email) {
        return SchedlesRepository.findByEmail(email);
    }

    static async findByRGM(rgm) {
        return SchedlesRepository.findByRGM(rgm);
    }

    static async findByShift(shift) {
        return SchedlesRepository.findByShift(shift);
    }
}

module.exports = SchedulesService;