// --- Configuração do Mock do SchedulesRepository ---
// Mockamos o Repositório para controlar o retorno dos dados de busca.
const mockSchedulesRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
    // Métodos essenciais para a lógica de create:
    findByDateAndShift: jest.fn(),
    countByDate: jest.fn(),
    // Outros métodos:
    findByRGM: jest.fn(),
    findByShift: jest.fn(),
    autenticate: jest.fn(),
};

// 1. Simula o módulo SchedulesRepository (caminho ajustado)
jest.mock('../../repositories/SchedulesRepository', () => mockSchedulesRepository);

// 2. Simula o próprio Service
jest.mock('../../services/SchedulesService', () => jest.requireActual('../../services/SchedulesService'));

// 3. Importa o Service
const SchedulesService = require('../../services/SchedulesService');

describe('SchedulesService', () => {

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES DE LÓGICA DE NEGÓCIO - CREATE
    // ====================================================================

    describe('create', () => {
        const scheduleData = { schedule_date: '2025-10-18', shift: 'Manhã', max_capacity: 10 };

        it('deve criar o agendamento se não houver conflitos e o limite de data não for atingido', async () => {
            const expectedResult = { id_schedule: 1, ...scheduleData };

            // Configuração para sucesso:
            mockSchedulesRepository.findByDateAndShift.mockResolvedValue(null); // Não existe
            mockSchedulesRepository.countByDate.mockResolvedValue(2); // Abaixo do limite (3)
            mockSchedulesRepository.create.mockResolvedValue(expectedResult);

            const result = await SchedulesService.create(scheduleData);

            expect(mockSchedulesRepository.findByDateAndShift).toHaveBeenCalledWith(scheduleData.schedule_date, scheduleData.shift);
            expect(mockSchedulesRepository.countByDate).toHaveBeenCalledWith(scheduleData.schedule_date);
            expect(mockSchedulesRepository.create).toHaveBeenCalledWith(scheduleData);
            expect(result).toEqual(expectedResult);
        });

        it('deve lançar erro se já existir agendamento para o turno e data', async () => {
            const existingSchedule = { id_schedule: 5, ...scheduleData };

            // Configuração para conflito:
            mockSchedulesRepository.findByDateAndShift.mockResolvedValue(existingSchedule);
            // Configuração restante não importa, pois o erro é lançado antes

            await expect(SchedulesService.create(scheduleData)).rejects.toThrow(
                'Já existe agendamento para este turno nesta data.'
            );

            expect(mockSchedulesRepository.findByDateAndShift).toHaveBeenCalledTimes(1);
            expect(mockSchedulesRepository.countByDate).not.toHaveBeenCalled(); // Não deve chegar aqui
            expect(mockSchedulesRepository.create).not.toHaveBeenCalled();
        });

        it('deve lançar erro se o limite máximo de agendamentos (3) para a data for atingido', async () => {

            // Configuração para limite atingido:
            mockSchedulesRepository.findByDateAndShift.mockResolvedValue(null); // OK, sem conflito de turno
            mockSchedulesRepository.countByDate.mockResolvedValue(3); // Limite atingido (>= 3)

            await expect(SchedulesService.create(scheduleData)).rejects.toThrow(
                'O limite máximo de 3 agendamentos para esta data foi atingido'
            );

            expect(mockSchedulesRepository.findByDateAndShift).toHaveBeenCalledTimes(1);
            expect(mockSchedulesRepository.countByDate).toHaveBeenCalledTimes(1);
            expect(mockSchedulesRepository.create).not.toHaveBeenCalled();
        });
    });

    // ====================================================================
    // TESTES DE DELEGAÇÃO (OUTROS MÉTODOS)
    // ====================================================================

    describe('Delegação dos demais métodos', () => {
        it('findById deve delegar para o Repositório', async () => {
            const id = 1;
            mockSchedulesRepository.findById.mockResolvedValue({ id_schedule: id });
            await SchedulesService.findById(id);
            expect(mockSchedulesRepository.findById).toHaveBeenCalledWith(id);
        });

        it('findAll deve delegar para o Repositório', async () => {
            mockSchedulesRepository.findAll.mockResolvedValue([]);
            await SchedulesService.findAll();
            expect(mockSchedulesRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it('update deve delegar para o Repositório', async () => {
            const id = 2;
            const data = { shift: 'Noite' };
            mockSchedulesRepository.update.mockResolvedValue(data);
            await SchedulesService.update(id, data);
            expect(mockSchedulesRepository.update).toHaveBeenCalledWith(id, data);
        });

        it('delete deve delegar para o Repositório', async () => {
            const id = 3;
            mockSchedulesRepository.delete.mockResolvedValue(1);
            await SchedulesService.delete(id);
            expect(mockSchedulesRepository.delete).toHaveBeenCalledWith(id);
        });

        it('findByEmail deve delegar para o Repositório', async () => {
            const email = 'user@test.com';
            mockSchedulesRepository.findByEmail.mockResolvedValue({});
            await SchedulesService.findByEmail(email);
            expect(mockSchedulesRepository.findByEmail).toHaveBeenCalledWith(email);
        });

        it('findByRGM deve delegar para o Repositório', async () => {
            const rgm = '12345';
            mockSchedulesRepository.findByRGM.mockResolvedValue({});
            await SchedulesService.findByRGM(rgm);
            expect(mockSchedulesRepository.findByRGM).toHaveBeenCalledWith(rgm);
        });

        it('findByShift deve delegar para o Repositório', async () => {
            const shift = 'Tarde';
            mockSchedulesRepository.findByShift.mockResolvedValue([]);
            await SchedulesService.findByShift(shift);
            expect(mockSchedulesRepository.findByShift).toHaveBeenCalledWith(shift);
        });
    });
});
