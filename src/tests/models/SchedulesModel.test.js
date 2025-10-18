// --- Configuração do Mock do Knex ---

// Objeto de simulação para os métodos encadeáveis (where, first, update, etc.)
const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    del: jest.fn(),
    count: jest.fn().mockReturnThis(),
    returning: jest.fn(),
};

// O mock principal da função Knex. Usamos 'mockKnex' para evitar erros de escopo (ReferenceError).
const mockKnex = jest.fn(() => mockQueryBuilder);

// Injectando o mock de 'fn.now()' para o método update
// IMPORTANTÍSSIMO: Criamos um mock que retorna um valor fixo para que possamos validar o payload.
const mockNow = jest.fn(() => 'MOCKED_KNEX_TIMESTAMP');
mockKnex.fn = {
    now: mockNow,
};

// 1. Simula o módulo Knex
jest.mock('../../knex', () => mockKnex);

// 2. Importa o Model
// Assumindo que o caminho é '../models/SchedulesModel' com base no seu contexto.
const SchedulesModel = require('../../models/SchedulesModel');

const TABLE_NAME = 'schedules';

describe('SchedulesModel', () => {

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findById(id_schedule)
    // ====================================================================
    describe('findById', () => {
        const scheduleId = 10;
        const mockSchedule = { id_schedule: scheduleId, shift: 'Manhã' };

        it('deve buscar o agendamento pelo ID e retornar o primeiro resultado', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockSchedule);

            const result = await SchedulesModel.findById(scheduleId);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_schedule: scheduleId });
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockSchedule);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findAll()
    // ====================================================================
    describe('findAll', () => {
        const mockSchedules = [{ id_schedule: 1, shift: 'Tarde' }];

        it('deve selecionar todos os agendamentos com os campos corretos', async () => {
            mockQueryBuilder.select.mockResolvedValue(mockSchedules);

            const result = await SchedulesModel.findAll();

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.select).toHaveBeenCalledWith(
                'id_schedule',
                'schedule_date',
                'shift',
                'max_capacity',
                'created_by_user_id'
            );
            expect(result).toEqual(mockSchedules);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: create(scheduleData)
    // ====================================================================
    describe('create', () => {
        const scheduleData = { schedule_date: '2025-11-01', shift: 'Noite', max_capacity: 5 };
        const newSchedule = { id_schedule: 50, ...scheduleData };

        it('deve inserir os dados e retornar o novo registro criado', async () => {
            mockQueryBuilder.returning.mockResolvedValue([newSchedule]);

            const result = await SchedulesModel.create(scheduleData);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.insert).toHaveBeenCalledWith(scheduleData);
            expect(mockQueryBuilder.returning).toHaveBeenCalledWith(
                'id_schedule',
                'schedule_date',
                'shift',
                'max_capacity',
                'created_by_user_id'
            );
            expect(result).toEqual(newSchedule);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: update(id_schedule, scheduleData)
    // ====================================================================
    describe('update', () => {
        const scheduleId = 50;
        const updateData = { max_capacity: 10, shift: 'Manhã' };
        // O valor retornado pelo Model deve usar o valor fixo 'MOCKED_KNEX_TIMESTAMP'
        const updatedSchedule = { id_schedule: scheduleId, ...updateData, updated_at: 'MOCKED_KNEX_TIMESTAMP' };

        it('deve atualizar os dados e incluir o timestamp de atualização do Knex', async () => {
            mockQueryBuilder.returning.mockResolvedValue([updatedSchedule]);
            
            // CORREÇÃO: O payload esperado deve conter o VALOR resolvido do mock,
            // pois o Knex.fn.now() é chamado dentro do Model antes de ser passado para o .update(data)
            const expectedUpdatePayload = {
                ...updateData,
                updated_at: 'MOCKED_KNEX_TIMESTAMP' // Agora esperamos a string, não a função de referência
            };

            const result = await SchedulesModel.update(scheduleId, updateData);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            // Verificamos que o mock.fn.now foi chamado (o que acontece dentro do Model)
            expect(mockKnex.fn.now).toHaveBeenCalledTimes(1);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_schedule: scheduleId });
            // Comparamos o payload que o Model gerou com a string resolvida
            expect(mockQueryBuilder.update).toHaveBeenCalledWith(expectedUpdatePayload);
            expect(result).toEqual(updatedSchedule);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: delete(id_schedule)
    // ====================================================================
    describe('delete', () => {
        const scheduleId = 60;
        const mockDeleteCount = 1;

        it('deve deletar o agendamento pelo ID', async () => {
            mockQueryBuilder.del.mockResolvedValue(mockDeleteCount);

            const result = await SchedulesModel.delete(scheduleId);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_schedule: scheduleId });
            expect(mockQueryBuilder.del).toHaveBeenCalledTimes(1);
            expect(result).toBe(mockDeleteCount);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findByEmail(email)
    // ====================================================================
    describe('findByEmail', () => {
        const mockEmail = 'test@example.com';
        const mockSchedule = { id_schedule: 70, email: mockEmail };

        it('deve buscar o agendamento pelo email e retornar o primeiro resultado', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockSchedule);

            const result = await SchedulesModel.findByEmail(mockEmail);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ email: mockEmail });
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockSchedule);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: countByDate(schedule_date)
    // ====================================================================
    describe('countByDate', () => {
        const mockDate = '2025-11-15';
        // Knex retorna o valor da contagem em uma string com o nome da coluna padrão 'count(*)'
        const mockCountResult = { 'count(*)': '5' };
        const expectedCount = 5;

        it('deve contar os agendamentos pela data e retornar um número inteiro', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockCountResult);

            const result = await SchedulesModel.countByDate(mockDate);

            // 1. Verifica a busca e o uso do count()
            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ schedule_date: mockDate });
            expect(mockQueryBuilder.count).toHaveBeenCalledTimes(1);

            // 2. Verifica se o resultado foi corretamente convertido para número
            expect(result).toBe(expectedCount);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findByDateAndShift(schedule_date, shift)
    // ====================================================================
    describe('findByDateAndShift', () => {
        const mockDate = '2025-12-01';
        const mockShift = 'Tarde';
        const mockSchedule = { id_schedule: 80, schedule_date: mockDate, shift: mockShift };

        it('deve buscar o agendamento pela data e turno (shift)', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockSchedule);

            const result = await SchedulesModel.findByDateAndShift(mockDate, mockShift);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            // Verifica a busca composta (schedule_date e shift)
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ schedule_date: mockDate, shift: mockShift });
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockSchedule);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: calculateMaxCapacity(max_capacity)
    // ====================================================================
    describe('calculateMaxCapacity', () => {
        const mockCapacity = 15;
        const mockResult = [{ id_schedule: 90, max_capacity: 15 }];

        it('deve buscar agendamentos pela capacidade máxima e retornar o query builder (resultado da query)', async () => {
            // No Model, a função não tem .first() ou .select() explícito, então Knex retorna o resultado do where
            mockQueryBuilder.where.mockResolvedValue(mockResult);

            const result = await SchedulesModel.calculateMaxCapacity(mockCapacity);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ max_capacity: mockCapacity });
            // Confirma que não foram chamados métodos de resolução como .first() ou .select()
            expect(mockQueryBuilder.first).not.toHaveBeenCalled();
            expect(mockQueryBuilder.select).not.toHaveBeenCalled();
            expect(result).toEqual(mockResult);
        });
    });
});
