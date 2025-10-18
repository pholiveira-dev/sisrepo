// --- Configuração do Mock do ReplacementsRepository ---
// Criamos um objeto com mocks para simular o comportamento do Repositório.
const mockReplacementsRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

// 1. Simula o módulo ReplacementsRepository (caminho ajustado para '../../repositories/ReplacementsRepository')
jest.mock('../../repositories/ReplacementsRepository', () => mockReplacementsRepository);

// 2. Simula o próprio Service, permitindo que o Jest o carregue normalmente
jest.mock('../../services/ReplacementsService', () => jest.requireActual('../../services/ReplacementsService'));

// 3. Importa o Service (caminho ajustado para '../../services/ReplacementService')
const ReplacementsService = require('../../services/ReplacementsService');

describe('ReplacementService', () => {

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste para garantir isolamento
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES DE DELEGAÇÃO BÁSICA (CRUD)
    // ====================================================================

    describe('findById', () => {
        it('deve delegar a chamada para ReplacementsRepository.findById com o ID correto', async () => {
            const id = 10;
            const expectedResult = { id_replacement: id, status: 'pending' };
            mockReplacementsRepository.findById.mockResolvedValue(expectedResult);

            const result = await ReplacementsService.findById(id);

            expect(mockReplacementsRepository.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('deve delegar a chamada para ReplacementsRepository.findAll', async () => {
            const expectedResult = [{ id_replacement: 1 }, { id_replacement: 2 }];
            mockReplacementsRepository.findAll.mockResolvedValue(expectedResult);

            const result = await ReplacementsService.findAll();

            expect(mockReplacementsRepository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('create', () => {
        it('deve delegar a chamada para ReplacementsRepository.create com os dados corretos', async () => {
            const replacementData = { studentId: 101, scheduleId: 202 };
            const expectedResult = { id_replacement: 30, ...replacementData };
            mockReplacementsRepository.create.mockResolvedValue(expectedResult);

            const result = await ReplacementsService.create(replacementData);

            expect(mockReplacementsRepository.create).toHaveBeenCalledWith(replacementData);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('deve delegar a chamada para ReplacementsRepository.update com ID e dados corretos', async () => {
            const id = 40;
            const updateData = { status: 'approved' };
            const expectedResult = { id_replacement: id, ...updateData };
            mockReplacementsRepository.update.mockResolvedValue(expectedResult);

            const result = await ReplacementsService.update(id, updateData);

            expect(mockReplacementsRepository.update).toHaveBeenCalledWith(id, updateData);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('delete', () => {
        it('deve delegar a chamada para ReplacementsRepository.delete com o ID correto', async () => {
            const id = 50;
            const mockDeleteCount = 1;
            mockReplacementsRepository.delete.mockResolvedValue(mockDeleteCount);

            const result = await ReplacementsService.delete(id);

            expect(mockReplacementsRepository.delete).toHaveBeenCalledWith(id);
            expect(result).toBe(mockDeleteCount);
        });
    });
});
