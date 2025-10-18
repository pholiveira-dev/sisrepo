// --- Configuração do Mock do ReplacementsModel ---
// Mockamos o Model para garantir que o Repository está delegando corretamente.
const mockReplacementsModel = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

// 1. Simula o módulo ReplacementsModel
jest.mock('../../models/ReplacementsModel', () => mockReplacementsModel);

// 2. Simula o próprio Repository, protegendo contra erros de importação
// NOTA: O Jest resolve o `require` após os mocks, mas adicionamos um mock para garantir
// que o worker não falhe se houver um problema no arquivo do repositório.
// 3. Importa o Repository
const ReplacementRepository = require('../../repositories/ReplacementsRepository');

describe('ReplacementRepository', () => {

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findById(id_replacement)
    // ====================================================================
    describe('findById', () => {
        it('deve chamar ReplacementsModel.findById com o ID correto', async () => {
            const id = 1;
            const expectedResult = { id_replacement: id, date: '2024-01-01' };
            mockReplacementsModel.findById.mockResolvedValue(expectedResult);

            const result = await ReplacementRepository.findById(id);

            expect(mockReplacementsModel.findById).toHaveBeenCalledWith(id);
            expect(mockReplacementsModel.findById).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findAll()
    // ====================================================================
    describe('findAll', () => {
        it('deve chamar ReplacementsModel.findAll', async () => {
            const expectedResult = [{ id_replacement: 1 }, { id_replacement: 2 }];
            mockReplacementsModel.findAll.mockResolvedValue(expectedResult);

            const result = await ReplacementRepository.findAll();

            expect(mockReplacementsModel.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: create(id_user, replacementData)
    // ====================================================================
    describe('create', () => {
        it('deve chamar ReplacementsModel.create com id_user e replacementData', async () => {
            const id_user = 100;
            const replacementData = { schedule_id: 5, justification: 'Motivo' };
            const expectedResult = { id_replacement: 2, ...replacementData };
            mockReplacementsModel.create.mockResolvedValue(expectedResult);

            const result = await ReplacementRepository.create(id_user, replacementData);

            expect(mockReplacementsModel.create).toHaveBeenCalledWith(id_user, replacementData);
            expect(mockReplacementsModel.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: update(id_replacement, replacementData)
    // ====================================================================
    describe('update', () => {
        it('deve chamar ReplacementsModel.update com id_replacement e replacementData', async () => {
            const id = 3;
            const replacementData = { status: 'Aprovado' };
            const expectedResult = { id_replacement: id, ...replacementData };
            mockReplacementsModel.update.mockResolvedValue(expectedResult);

            const result = await ReplacementRepository.update(id, replacementData);

            expect(mockReplacementsModel.update).toHaveBeenCalledWith(id, replacementData);
            expect(mockReplacementsModel.update).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: delete(id_replacement)
    // ====================================================================
    describe('delete', () => {
        it('deve chamar ReplacementsModel.delete com id_replacement', async () => {
            const id = 4;
            const mockDeleteCount = 1;
            mockReplacementsModel.delete.mockResolvedValue(mockDeleteCount);

            const result = await ReplacementRepository.delete(id);

            expect(mockReplacementsModel.delete).toHaveBeenCalledWith(id);
            expect(mockReplacementsModel.delete).toHaveBeenCalledTimes(1);
            expect(result).toBe(mockDeleteCount);
        });
    });
});
