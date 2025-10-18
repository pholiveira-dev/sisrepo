// --- Configuração do Mock do SchedulesModel ---
// Criamos um objeto com mocks para simular o comportamento do Model.
const mockSchedulesModel = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
    countByDate: jest.fn(),
    findByDateAndShift: jest.fn(),
    calculateMaxCapacity: jest.fn(),
};

// 1. Simula o módulo SchedulesModel (caminho ajustado para '../../models/SchedulesModel')
jest.mock('../../models/SchedulesModel', () => mockSchedulesModel);

// 2. Simula o próprio Repository, permitindo que o Jest o carregue normalmente
jest.mock('../../repositories/SchedulesRepository', () => jest.requireActual('../../repositories/SchedulesRepository'));

// 3. Importa o Repository (caminho ajustado para '../../repositories/SchedulesRepository')
const SchedulesRepository = require('../../repositories/SchedulesRepository');

describe('SchedulesRepository', () => {

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste para garantir isolamento
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES DE CRUD BÁSICO
    // ====================================================================

    describe('findById', () => {
        it('deve chamar SchedulesModel.findById com o ID correto', async () => {
            const id = 10;
            const expectedResult = { id_schedule: id, date: '2024-11-10' };
            mockSchedulesModel.findById.mockResolvedValue(expectedResult);

            const result = await SchedulesRepository.findById(id);

            expect(mockSchedulesModel.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('deve chamar SchedulesModel.findAll', async () => {
            const expectedResult = [{ id_schedule: 1 }, { id_schedule: 2 }];
            mockSchedulesModel.findAll.mockResolvedValue(expectedResult);

            const result = await SchedulesRepository.findAll();

            expect(mockSchedulesModel.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('create', () => {
        it('deve chamar SchedulesModel.create com os dados corretos', async () => {
            const scheduleData = { schedule_date: '2024-12-01', shift: 'Tarde' };
            const expectedResult = { id_schedule: 20, ...scheduleData };
            mockSchedulesModel.create.mockResolvedValue(expectedResult);

            const result = await SchedulesRepository.create(scheduleData);

            expect(mockSchedulesModel.create).toHaveBeenCalledWith(scheduleData);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('deve chamar SchedulesModel.update com ID e dados corretos', async () => {
            const id = 30;
            const updateData = { max_capacity: 15 };
            const expectedResult = { id_schedule: id, ...updateData };
            mockSchedulesModel.update.mockResolvedValue(expectedResult);

            const result = await SchedulesRepository.update(id, updateData);

            expect(mockSchedulesModel.update).toHaveBeenCalledWith(id, updateData);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('delete', () => {
        it('deve chamar SchedulesModel.delete com o ID correto', async () => {
            const id = 40;
            const mockDeleteCount = 1;
            mockSchedulesModel.delete.mockResolvedValue(mockDeleteCount);

            const result = await SchedulesRepository.delete(id);

            expect(mockSchedulesModel.delete).toHaveBeenCalledWith(id);
            expect(result).toBe(mockDeleteCount);
        });
    });

    // ====================================================================
    // TESTES DE MÉTODOS ESPECÍFICOS
    // ====================================================================

    describe('findByEmail', () => {
        it('deve chamar SchedulesModel.findByEmail com o email correto', async () => {
            const email = 'test@example.com';
            const expectedResult = { email, user_id: 1 };
            mockSchedulesModel.findByEmail.mockResolvedValue(expectedResult);

            const result = await SchedulesRepository.findByEmail(email);

            expect(mockSchedulesModel.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('countByDate', () => {
        it('deve chamar SchedulesModel.countByDate com a data correta', async () => {
            const date = '2024-12-10';
            const expectedCount = 5;
            mockSchedulesModel.countByDate.mockResolvedValue(expectedCount);

            const result = await SchedulesRepository.countByDate(date);

            expect(mockSchedulesModel.countByDate).toHaveBeenCalledWith(date);
            expect(result).toBe(expectedCount);
        });
    });

    describe('findByDateAndShift', () => {
        it('deve chamar SchedulesModel.findByDateAndShift com data e turno corretos', async () => {
            const date = '2024-12-10';
            const shift = 'Manhã';
            const expectedResult = { schedule_date: date, shift: shift, max_capacity: 10 };
            mockSchedulesModel.findByDateAndShift.mockResolvedValue(expectedResult);

            const result = await SchedulesRepository.findByDateAndShift(date, shift);

            expect(mockSchedulesModel.findByDateAndShift).toHaveBeenCalledWith(date, shift);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('calculateMaxCapacity', () => {
        it('deve chamar SchedulesModel.calculateMaxCapacity com a capacidade máxima correta', async () => {
            const maxCapacity = 20;
            const expectedResult = [{ id: 1, max_capacity: 20 }];
            mockSchedulesModel.calculateMaxCapacity.mockResolvedValue(expectedResult);

            const result = await SchedulesRepository.calculateMaxCapacity(maxCapacity);

            expect(mockSchedulesModel.calculateMaxCapacity).toHaveBeenCalledWith(maxCapacity);
            expect(result).toEqual(expectedResult);
        });
    });
});
