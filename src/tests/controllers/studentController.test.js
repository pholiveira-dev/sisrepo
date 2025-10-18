// students.controller.test.js

// Ajuste o caminho de importação conforme a sua estrutura de pastas
const StudentsController = require('../../controllers/studentsController');
// Importar o caminho real do StudentsService
const StudentsService = require('../../services/StudentsService'); 

// MOCK do StudentsService para isolar o Controller
jest.mock('../../services/StudentsService');

beforeEach(() => {
    // jest.clearAllMocks() reseta o contador de chamadas para 0.
    jest.clearAllMocks(); 
}); 

// Configuração básica de mocks para req e res
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// =========================================================================
// TESTES PARA getAll
// =========================================================================
describe('StudentsController.getAll', () => {
    it('deve retornar status 200 e todos os estudantes em caso de sucesso', async () => {
        const mockStudents = [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }];
        StudentsService.findAll.mockResolvedValue(mockStudents);

        const req = {}; 
        const res = mockResponse();

        await StudentsController.getAll(req, res);

        expect(StudentsService.findAll).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockStudents);
    });

    it('deve retornar status 500 em caso de erro no servidor', async () => {
        const mockError = new Error('Database connection failed');
        StudentsService.findAll.mockRejectedValue(mockError);

        const req = {};
        const res = mockResponse();

        await StudentsController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Erro interno no servido ao encontrar todos os alunos no banco de dados.'
        });
    });
});

// =========================================================================
// TESTES PARA getId
// =========================================================================
describe('StudentsController.getId', () => {
    const mockStudent = { id: 'abc-123', name: 'Carol' };

    it('deve retornar status 200 e o estudante encontrado', async () => {
        StudentsService.findById.mockResolvedValue(mockStudent);

        const req = { params: { id_student: 'abc-123' } };
        const res = mockResponse();

        await StudentsController.getId(req, res);

        expect(StudentsService.findById).toHaveBeenCalledWith('abc-123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockStudent);
    });

    it('deve retornar status 400 se o id_student não for fornecido', async () => {
        const req = { params: {} }; 
        const res = mockResponse();

        await StudentsController.getId(req, res);

        expect(StudentsService.findById).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Problema na requisição.' });
    });

    it('deve retornar status 404 se o estudante não for encontrado', async () => {
        StudentsService.findById.mockResolvedValue(null);

        const req = { params: { id_student: 'nao-existe' } };
        const res = mockResponse();

        await StudentsController.getId(req, res);

        expect(StudentsService.findById).toHaveBeenCalledWith('nao-existe');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'O ID do usuário não existe no sistema.' });
    });

    it('deve retornar status 500 em caso de erro interno no Service', async () => {
        const mockError = new Error('Service failed to find student');
        StudentsService.findById.mockRejectedValue(mockError);

        const req = { params: { id_student: 'some-id' } };
        const res = mockResponse();

        await StudentsController.getId(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno no servidor ao encontrar o ID do estudante.' });
    });
});

// =========================================================================
// TESTES PARA postStudent (Com teste adicional de RGM string/trim)
// =========================================================================
describe('StudentsController.postStudent', () => {
    const userId = 'user-admin-1';
    const studentDataBase = { name: 'David', email: 'david@example.com', current_semester: 3 };

    it('deve retornar status 201 e o estudante criado (RGM como número)', async () => {
        const rgmNum = 123456789;
        const rgmString = '123456789';
        const newStudent = { id: 'new-id-123', ...studentDataBase, rgm: rgmString };

        StudentsService.create.mockResolvedValue(newStudent);

        const req = { user: { id_user: userId }, body: { ...studentDataBase, rgm: rgmNum } };
        const res = mockResponse();

        await StudentsController.postStudent(req, res);

        expect(StudentsService.create).toHaveBeenCalledWith(
            { ...studentDataBase, rgm: rgmString }, // Verifica que foi convertido para string
            userId
        );
        expect(res.status).toHaveBeenCalledWith(201);
    });
    
    it('deve retornar status 201 e o estudante criado (RGM como string com trim)', async () => {
        const rgmWithSpaces = '987654321 '; 
        const rgmStringTrimmed = '987654321';
        const newStudent = { id: 'new-id-456', ...studentDataBase, rgm: rgmStringTrimmed };

        StudentsService.create.mockResolvedValue(newStudent);

        const req = { user: { id_user: userId }, body: { ...studentDataBase, rgm: rgmWithSpaces } };
        const res = mockResponse();

        await StudentsController.postStudent(req, res);

        // O Service deve ser chamado com o RGM TRIMMADO
        expect(StudentsService.create).toHaveBeenCalledWith(
            { ...studentDataBase, rgm: rgmStringTrimmed }, 
            userId
        );
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('deve retornar status 500 em caso de erro interno ou erro de validação do Service', async () => {
        const mockError = new Error('RGM já cadastrado na nossa base de dados.');
        StudentsService.create.mockRejectedValue(mockError);

        const req = { user: { id_user: 'user-id' }, body: { ...studentDataBase, rgm: 111 } };
        const res = mockResponse();

        await StudentsController.postStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor ao criar o usuário' });
    });
});

// =========================================================================
// TESTES PARA putStudent (Com cobertura de campos parciais)
// =========================================================================
describe('StudentsController.putStudent', () => {
    const studentId = 'student-id-123';
    const userId = 'user-admin-456';
    const mockUpdatedStudent = { id: studentId, email: 'new@email.com', rgm: '987654321' };

    it('deve retornar status 200 e o estudante atualizado em caso de sucesso (com email e rgm)', async () => {
        StudentsService.update.mockResolvedValue(mockUpdatedStudent);

        const req = {
            user: { id_user: userId },
            params: { id_student: studentId },
            body: { email: 'new@email.com', rgm: 987654321 }
        };
        const res = mockResponse();

        await StudentsController.putStudent(req, res);

        expect(StudentsService.update).toHaveBeenCalledWith(
            studentId, 
            userId, 
            { email: 'new@email.com', rgm: 987654321 }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUpdatedStudent);
    });

    // NOVO CENÁRIO: Atualização Parcial (Apenas Email)
    it('deve retornar status 200 ao atualizar APENAS o email', async () => {
        const updatedEmail = { id: studentId, email: 'only@email.com' };
        StudentsService.update.mockResolvedValue(updatedEmail);

        const req = {
            user: { id_user: userId },
            params: { id_student: studentId },
            body: { email: 'only@email.com' } // Apenas email
        };
        const res = mockResponse();

        await StudentsController.putStudent(req, res);

        expect(StudentsService.update).toHaveBeenCalledWith(
            studentId,
            userId,
            { email: 'only@email.com' } // Verifica que apenas o email foi passado
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedEmail);
    });

    // NOVO CENÁRIO: Atualização Parcial (Apenas RGM)
    it('deve retornar status 200 ao atualizar APENAS o rgm', async () => {
        const updatedRGM = { id: studentId, rgm: 999999999 };
        StudentsService.update.mockResolvedValue(updatedRGM);

        const req = {
            user: { id_user: userId },
            params: { id_student: studentId },
            body: { rgm: 999999999 } // Apenas RGM
        };
        const res = mockResponse();

        await StudentsController.putStudent(req, res);

        expect(StudentsService.update).toHaveBeenCalledWith(
            studentId,
            userId,
            { rgm: 999999999 } // Verifica que apenas o rgm foi passado
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedRGM);
    });
    
    // CENÁRIO EXISTENTE: id_user ausente
    it('deve retornar status 400 se o id_user não for fornecido', async () => {
        const req = {
            user: {},
            params: { id_student: studentId },
            body: { email: 'new@email.com' }
        };
        const res = mockResponse();

        await StudentsController.putStudent(req, res);

        expect(StudentsService.update).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'ID do usuário não fornecido.' });
    });

    // CENÁRIO EXISTENTE: id_student ausente
    it('deve retornar status 400 se o id_student não for fornecido na URL', async () => {
        const req = {
            user: { id_user: userId },
            params: {}, 
            body: { email: 'new@email.com' }
        };
        const res = mockResponse();

        await StudentsController.putStudent(req, res);

        expect(StudentsService.update).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'ID do estudante não fornecido na URL.' });
    });

    // CENÁRIO EXISTENTE: Erro interno
    it('deve retornar status 500 em caso de erro interno no Service', async () => {
        const mockError = new Error('Update failed due to business logic');
        StudentsService.update.mockRejectedValue(mockError);

        const req = {
            user: { id_user: userId },
            params: { id_student: studentId },
            body: { email: 'new@email.com' }
        };
        const res = mockResponse();

        await StudentsController.putStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor ao tentar atualizar o estudante.' });
    });
});

// =========================================================================
// TESTES PARA deleteStudent
// =========================================================================
describe('StudentsController.deleteStudent', () => {
    const studentId = 'student-id-to-delete';

    it('deve retornar status 204 (No Content) em caso de sucesso', async () => {
        StudentsService.delete.mockResolvedValue(true); 

        const req = { params: { id_student: studentId } };
        const res = mockResponse();

        await StudentsController.deleteStudent(req, res);

        expect(StudentsService.delete).toHaveBeenCalledWith(studentId);
        expect(res.status).toHaveBeenCalledWith(204); 
        expect(res.json).toHaveBeenCalled(); 
    });

    it('deve retornar status 500 em caso de erro interno no Service', async () => {
        const mockError = new Error('Deletion failed at database level');
        StudentsService.delete.mockRejectedValue(mockError);

        const req = { params: { id_student: studentId } };
        const res = mockResponse();

        await StudentsController.deleteStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno no servidor.' });
    });
});