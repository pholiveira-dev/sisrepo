// --- Configuração do Mock do UserModel ---
// Criamos um objeto com mocks para simular o comportamento do Model.
const mockUserModel = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
    findByPosition: jest.fn(),
    authenticate: jest.fn(), // Adicionado o mock para o novo método
};

// 1. Simula o módulo UserModel (caminho ajustado para '../../models/UserModel')
jest.mock('../../models/UserModel', () => mockUserModel);

// 2. Simula o próprio Repository, permitindo que o Jest o carregue normalmente
jest.mock('../../repositories/UserRepository', () => jest.requireActual('../../repositories/UserRepository'));

// 3. Importa o Repository (caminho ajustado para '../../repositories/UserRepository')
const UserRepository = require('../../repositories/UserRepository');

describe('UserRepository', () => {

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste para garantir isolamento
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES DE CRUD BÁSICO
    // ====================================================================

    describe('findById', () => {
        it('deve chamar UserModel.findById com o ID correto', async () => {
            const id = 1;
            const expectedResult = { id_user: id, email: 'user@test.com' };
            mockUserModel.findById.mockResolvedValue(expectedResult);

            const result = await UserRepository.findById(id);

            expect(mockUserModel.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('deve chamar UserModel.findAll', async () => {
            const expectedResult = [{ id_user: 1 }, { id_user: 2 }];
            mockUserModel.findAll.mockResolvedValue(expectedResult);

            const result = await UserRepository.findAll();

            expect(mockUserModel.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('create', () => {
        it('deve chamar UserModel.create com os dados corretos', async () => {
            const userData = { name: 'Novo User', email: 'new@user.com' };
            const expectedResult = { id_user: 3, ...userData };
            mockUserModel.create.mockResolvedValue(expectedResult);

            const result = await UserRepository.create(userData);

            expect(mockUserModel.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('deve chamar UserModel.update com ID e dados corretos', async () => {
            const id = 1;
            const updateData = { position: 'Gerente' };
            const expectedResult = { id_user: id, ...updateData };
            mockUserModel.update.mockResolvedValue(expectedResult);

            const result = await UserRepository.update(id, updateData);

            expect(mockUserModel.update).toHaveBeenCalledWith(id, updateData);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('delete', () => {
        it('deve chamar UserModel.delete com o ID correto', async () => {
            const id = 4;
            const mockDeleteCount = 1;
            mockUserModel.delete.mockResolvedValue(mockDeleteCount);

            const result = await UserRepository.delete(id);

            expect(mockUserModel.delete).toHaveBeenCalledWith(id);
            expect(result).toBe(mockDeleteCount);
        });
    });

    // ====================================================================
    // TESTES DE MÉTODOS ESPECÍFICOS
    // ====================================================================

    describe('findByEmail', () => {
        it('deve chamar UserModel.findByEmail com o email correto', async () => {
            const email = 'search@example.com';
            const expectedResult = { id_user: 5, email };
            mockUserModel.findByEmail.mockResolvedValue(expectedResult);

            const result = await UserRepository.findByEmail(email);

            expect(mockUserModel.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByPosition', () => {
        it('deve chamar UserModel.findByPosition com a posição correta', async () => {
            const position = 'Professor';
            const expectedResult = [{ id_user: 6, position }, { id_user: 7, position }];
            mockUserModel.findByPosition.mockResolvedValue(expectedResult);

            const result = await UserRepository.findByPosition(position);

            expect(mockUserModel.findByPosition).toHaveBeenCalledWith(position);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('authenticate', () => {
        it('deve chamar UserModel.authenticate com email e senha corretos', async () => {
            const email = 'auth@test.com';
            const password = 'securepassword';
            const expectedResult = { id_user: 8, email, authenticated: true };
            mockUserModel.authenticate.mockResolvedValue(expectedResult);

            const result = await UserRepository.authenticate(email, password);

            expect(mockUserModel.authenticate).toHaveBeenCalledWith(email, password);
            expect(result).toEqual(expectedResult);
        });
    });
});
