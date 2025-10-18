// --- Configuração do Mock do Knex ---

// Objeto de simulação para os métodos encadeáveis (where, first, update, select, etc.)
const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    del: jest.fn(),
    returning: jest.fn(),
};

// O mock principal da função Knex. Usamos 'mockKnex' para evitar erros de escopo.
const mockKnex = jest.fn(() => mockQueryBuilder);

// 1. Simula o módulo Knex
jest.mock('../../knex', () => mockKnex);

// 2. Importa o Model (assumindo que o caminho é '../models/UserModel')
const UserModel = require('../../models/UserModel');

const TABLE_NAME = 'users';
const RETURN_FIELDS = ['id_user', 'name', 'email', 'position'];

describe('UserModel', () => {

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findById(id_user)
    // ====================================================================
    describe('findById', () => {
        const userId = 10;
        const mockUser = { id_user: userId, name: 'João' };

        it('deve buscar o usuário pelo ID e retornar o primeiro resultado', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockUser);

            const result = await UserModel.findById(userId);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_user: userId });
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUser);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findAll()
    // ====================================================================
    describe('findAll', () => {
        const mockUsers = [{ id_user: 1, name: 'User1' }, { id_user: 2, name: 'User2' }];

        it('deve selecionar todos os usuários com os campos definidos', async () => {
            mockQueryBuilder.select.mockResolvedValue(mockUsers);

            const result = await UserModel.findAll();

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.select).toHaveBeenCalledWith(RETURN_FIELDS);
            expect(result).toEqual(mockUsers);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: create(userData)
    // ====================================================================
    describe('create', () => {
        const userData = { name: 'Novo User', email: 'novo@user.com', position: 'Professor' };
        const newUser = { id_user: 50, ...userData };

        it('deve inserir os dados do usuário e retornar o novo registro criado', async () => {
            mockQueryBuilder.returning.mockResolvedValue([newUser]);

            const result = await UserModel.create(userData);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.insert).toHaveBeenCalledWith(userData);
            expect(mockQueryBuilder.returning).toHaveBeenCalledWith(RETURN_FIELDS);
            expect(result).toEqual(newUser);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: update(id_user, userData)
    // ====================================================================
    describe('update', () => {
        const userId = 50;
        const updateData = { name: 'User Atualizado', position: 'Coordenador' };
        const updatedUser = { id_user: userId, email: 'old@user.com', ...updateData };

        it('deve atualizar os dados do usuário pelo ID e retornar o registro atualizado', async () => {
            mockQueryBuilder.returning.mockResolvedValue([updatedUser]);

            const result = await UserModel.update(userId, updateData);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_user: userId });
            expect(mockQueryBuilder.update).toHaveBeenCalledWith(updateData);
            expect(mockQueryBuilder.returning).toHaveBeenCalledWith(RETURN_FIELDS);
            expect(result).toEqual(updatedUser);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: delete(id_user)
    // ====================================================================
    describe('delete', () => {
        const userId = 60;
        const mockDeleteCount = 1;

        it('deve deletar o usuário pelo ID', async () => {
            mockQueryBuilder.del.mockResolvedValue(mockDeleteCount);

            const result = await UserModel.delete(userId);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_user: userId });
            expect(mockQueryBuilder.del).toHaveBeenCalledTimes(1);
            expect(result).toBe(mockDeleteCount);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findByEmail(email)
    // ====================================================================
    describe('findByEmail', () => {
        const mockEmail = 'user@email.com';
        const mockUser = { id_user: 70, email: mockEmail };

        it('deve buscar o usuário pelo email e retornar o primeiro resultado', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockUser);

            const result = await UserModel.findByEmail(mockEmail);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ email: mockEmail });
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUser);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findByPosition(position)
    // ====================================================================
    describe('findByPosition', () => {
        const mockPosition = 'Professor';
        const mockResult = [{ id_user: 80, position: mockPosition }];

        it('deve buscar todos os usuários por posição', async () => {
            // O UserModel usa explicitamente knex('users')
            mockKnex.mockImplementationOnce(() => mockQueryBuilder);
            mockQueryBuilder.where.mockResolvedValue(mockResult);

            const result = await UserModel.findByPosition(mockPosition);

            // Verifica se knex foi chamado com 'users' (explicitamente no Model)
            expect(mockKnex).toHaveBeenCalledWith('users');
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ position: mockPosition });
            // Confirma que não foram chamados métodos de resolução como .first() ou .select()
            expect(mockQueryBuilder.first).not.toHaveBeenCalled();
            expect(mockQueryBuilder.select).not.toHaveBeenCalled();
            expect(result).toEqual(mockResult);
        });
    });
});
