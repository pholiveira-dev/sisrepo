// --- Configuração do Mock do StudentsModel ---
// Criamos um objeto com mocks para simular o comportamento do Model.
const mockStudentsModel = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
    findByRGM: jest.fn(),
    findByEmailAndAcessCode: jest.fn(),
};

// 1. Simula o módulo StudentsModel (caminho ajustado para '../../models/StudentsModel')
jest.mock('../../models/StudentsModel', () => mockStudentsModel);

// 2. Simula o próprio Repository, permitindo que o Jest o carregue normalmente
jest.mock('../../repositories/StudentsRepository', () => jest.requireActual('../../repositories/StudentsRepository'));

// 3. Importa o Repository (caminho ajustado para '../../repositories/StudentsRepository')
const StudentsRepository = require('../../repositories/StudentsRepository');

describe('StudentsRepository', () => {

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste para garantir isolamento
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES DE CRUD BÁSICO
    // ====================================================================

    describe('findById', () => {
        it('deve chamar StudentsModel.findById com o ID correto', async () => {
            const id = 1;
            const expectedResult = { id_student: id, email: 'student1@test.com' };
            mockStudentsModel.findById.mockResolvedValue(expectedResult);

            const result = await StudentsRepository.findById(id);

            expect(mockStudentsModel.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('deve chamar StudentsModel.findAll', async () => {
            const expectedResult = [{ id_student: 1 }, { id_student: 2 }];
            mockStudentsModel.findAll.mockResolvedValue(expectedResult);

            const result = await StudentsRepository.findAll();

            expect(mockStudentsModel.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('create', () => {
        it('deve chamar StudentsModel.create com studentData e id_user corretos', async () => {
            const studentData = { email: 'new@student.com', rgm: '12345' };
            const id_user = 99;
            const expectedResult = { id_student: 3, ...studentData, created_by_user_id: id_user };
            mockStudentsModel.create.mockResolvedValue(expectedResult);

            const result = await StudentsRepository.create(studentData, id_user);

            expect(mockStudentsModel.create).toHaveBeenCalledWith(studentData, id_user);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('deve chamar StudentsModel.update com id_student, id_user e studentData corretos', async () => {
            const id_student = 1;
            const id_user = 99;
            const updateData = { rgm: '98765' };
            const expectedResult = { id_student, ...updateData, updated_by_user_id: id_user };
            mockStudentsModel.update.mockResolvedValue(expectedResult);

            const result = await StudentsRepository.update(id_student, id_user, updateData);

            expect(mockStudentsModel.update).toHaveBeenCalledWith(id_student, id_user, updateData);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('delete', () => {
        it('deve chamar StudentsModel.delete com o ID correto', async () => {
            const id = 4;
            const mockDeleteCount = 1;
            mockStudentsModel.delete.mockResolvedValue(mockDeleteCount);

            const result = await StudentsRepository.delete(id);

            expect(mockStudentsModel.delete).toHaveBeenCalledWith(id);
            expect(result).toBe(mockDeleteCount);
        });
    });

    // ====================================================================
    // TESTES DE MÉTODOS ESPECÍFICOS
    // ====================================================================

    describe('findByEmail', () => {
        it('deve chamar StudentsModel.findByEmail com o email correto', async () => {
            const email = 'test@example.com';
            const expectedResult = { id_student: 1, email };
            mockStudentsModel.findByEmail.mockResolvedValue(expectedResult);

            const result = await StudentsRepository.findByEmail(email);

            expect(mockStudentsModel.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByRGM', () => {
        it('deve chamar StudentsModel.findByRGM com o RGM correto', async () => {
            const rgm = '54321';
            const expectedResult = { id_student: 2, rgm };
            mockStudentsModel.findByRGM.mockResolvedValue(expectedResult);

            const result = await StudentsRepository.findByRGM(rgm);

            expect(mockStudentsModel.findByRGM).toHaveBeenCalledWith(rgm);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEmailAndAcessCode', () => {
        it('deve chamar StudentsModel.findByEmailAndAcessCode com email e código de acesso corretos', async () => {
            const email = 'test@example.com';
            const access_code = 'ABC123';
            const expectedResult = { id_student: 1, email, access_code };
            mockStudentsModel.findByEmailAndAcessCode.mockResolvedValue(expectedResult);

            const result = await StudentsRepository.findByEmailAndAcessCode(email, access_code);

            expect(mockStudentsModel.findByEmailAndAcessCode).toHaveBeenCalledWith(email, access_code);
            expect(result).toEqual(expectedResult);
        });
    });
});
