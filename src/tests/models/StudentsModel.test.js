// --- Configuração do Mock do Knex (Reutilizada) ---

// Objeto de simulação para os métodos encadeáveis (where, first, update, etc.)
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

// 2. Importa o Model
const StudentsModel = require('../../models/StudentsModel');

const TABLE_NAME = 'students';
const RETURN_FIELDS = ['id_student', 'email', 'rgm', 'created_by_user_id', 'updated_by_user_id'];

describe('StudentsModel', () => {

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findById(id_student)
    // ====================================================================
    describe('findById', () => {
        const studentId = 1;
        const mockStudent = { id_student: studentId, email: 'aluno@teste.com' };

        it('deve buscar o estudante pelo ID e retornar o primeiro resultado', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockStudent);

            const result = await StudentsModel.findById(studentId);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_student: studentId });
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockStudent);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findAll()
    // ====================================================================
    describe('findAll', () => {
        const mockStudents = [{ id_student: 1, email: 'aluno1@test.com' }, { id_student: 2, email: 'aluno2@test.com' }];

        it('deve selecionar todos os estudantes com os campos definidos', async () => {
            mockQueryBuilder.select.mockResolvedValue(mockStudents);

            const result = await StudentsModel.findAll();

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.select).toHaveBeenCalledWith(RETURN_FIELDS);
            expect(result).toEqual(mockStudents);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: create(studentData, id_user)
    // ====================================================================
    describe('create', () => {
        const studentData = { email: 'novo@aluno.com', rgm: '12345' };
        const id_user = 100;
        const newStudent = { id_student: 50, created_by_user_id: id_user, ...studentData };
        // No Model, 'id_user' é passado como segundo argumento do .insert(), o Knex geralmente não usa
        // esse argumento para inserção de dados, mas o código de teste deve respeitar o contrato.
        // Contudo, para fins práticos de teste unitário, o que importa é o payload do insert.
        const expectedInsertData = studentData; 

        it('deve inserir os dados do estudante e retornar o novo registro criado', async () => {
            mockQueryBuilder.returning.mockResolvedValue([newStudent]);

            const result = await StudentsModel.create(studentData, id_user);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            // Verifica que o payload de dados foi passado
            expect(mockQueryBuilder.insert).toHaveBeenCalledWith(expectedInsertData, id_user);
            expect(mockQueryBuilder.returning).toHaveBeenCalledWith(RETURN_FIELDS);
            expect(result).toEqual(newStudent);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: update(id_student, id_user, studentData)
    // ====================================================================
    describe('update', () => {
        const studentId = 50;
        const id_user = 101;
        const updateData = { rgm: '99999', updated_by_user_id: id_user };
        const updatedStudent = { id_student: studentId, email: 'old@aluno.com', ...updateData };

        it('deve atualizar os dados do estudante pelo ID e retornar o registro atualizado', async () => {
            mockQueryBuilder.returning.mockResolvedValue([updatedStudent]);
            
            // NOTE: A função 'update' do Model ignora 'id_user' no payload e usa apenas studentData
            const result = await StudentsModel.update(studentId, id_user, updateData);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_student: studentId });
            expect(mockQueryBuilder.update).toHaveBeenCalledWith(updateData);
            expect(mockQueryBuilder.returning).toHaveBeenCalledWith(RETURN_FIELDS);
            expect(result).toEqual(updatedStudent);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: delete(id_student)
    // ====================================================================
    describe('delete', () => {
        const studentId = 60;
        const mockDeleteCount = 1;

        it('deve deletar o estudante pelo ID', async () => {
            mockQueryBuilder.del.mockResolvedValue(mockDeleteCount);

            const result = await StudentsModel.delete(studentId);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_student: studentId });
            expect(mockQueryBuilder.del).toHaveBeenCalledTimes(1);
            expect(result).toBe(mockDeleteCount);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findByEmail(email)
    // ====================================================================
    describe('findByEmail', () => {
        const mockEmail = 'aluno@email.com';
        const mockStudent = { id_student: 70, email: mockEmail };

        it('deve buscar o estudante pelo email e retornar o primeiro resultado', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockStudent);

            const result = await StudentsModel.findByEmail(mockEmail);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ email: mockEmail });
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockStudent);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findByRGM(rgm)
    // ====================================================================
    describe('findByRGM', () => {
        const mockRGM = '54321';
        const mockStudent = { id_student: 80, rgm: mockRGM };

        it('deve buscar o estudante pelo RGM e retornar o primeiro resultado', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockStudent);

            const result = await StudentsModel.findByRGM(mockRGM);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ rgm: mockRGM });
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockStudent);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findByEmailAndAcessCode(email, access_code)
    // ====================================================================
    describe('findByEmailAndAcessCode', () => {
        const mockEmail = 'aluno@email.com';
        const mockAccessCode = 'XYZ123';
        const mockStudent = { id_student: 90, email: mockEmail, access_code: mockAccessCode };

        it('deve buscar o estudante pelo email e código de acesso', async () => {
            mockQueryBuilder.first.mockResolvedValue(mockStudent);

            const result = await StudentsModel.findByEmailAndAcessCode(mockEmail, mockAccessCode);

            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ email: mockEmail, access_code: mockAccessCode });
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockStudent);
        });
    });
});
