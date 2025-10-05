// studentController.test.js

// 1. Simulação do módulo de conexão Knex
// ISTO DEVE VIR ANTES DE QUALQUER 'require' QUE POSSA CHAMAR O KNEX REAL.
// O Jest irá procurar um mock manual em src/__mocks__/knex.js.
jest.mock('../../knex', () => ({
    // Simula apenas o suficiente para que a importação não falhe
    raw: jest.fn().mockResolvedValue(null),
    select: jest.fn().mockReturnThis(),
}));

// 2. Garante o carregamento das variáveis de ambiente
require('dotenv').config();

// 3. Simula o módulo StudentService
// IMPORTANTE: A simulação de um módulo deve vir antes do seu 'require'.
jest.mock('../../services/StudentService');
const StudentService = require('../../services/StudentService');

// 4. Importa o Controller (que agora usa os módulos simulados)
const { getAll, postStudent } = require('../../controllers/studentController');


// Simulação de objetos Express: Request (req) e Response (res)
const mockRequest = (body = {}, user = {}) => ({
    body,
    user,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

// --- Início dos Testes ---

describe('StudentController', () => {
    let req, res;

    beforeEach(() => {
        // Inicializa as simulações de resposta antes de cada teste
        res = mockResponse();
        // Limpa as simulações do serviço para que um teste não interfira no outro
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: getAll
    // ====================================================================
    describe('getAll', () => {
        it('deve retornar 200 e todos os alunos se a busca for bem-sucedida', async () => {
            const mockStudents = [{ id: 1, name: 'Aluno A' }];
            // Simula que o serviço encontrou alunos
            StudentService.findAll.mockResolvedValue(mockStudents);

            req = mockRequest();
            await getAll(req, res);

            // Verifica se o serviço foi chamado
            expect(StudentService.findAll).toHaveBeenCalledTimes(1);
            // Verifica se o status HTTP foi 200
            expect(res.status).toHaveBeenCalledWith(200);
            // Verifica se os dados dos alunos foram retornados
            expect(res.json).toHaveBeenCalledWith(mockStudents);
        });

        it('deve retornar 400 se o serviço falhar', async () => {
            const errorMessage = new Error('Erro de conexão com o banco.');
            // Simula que o serviço falhou
            StudentService.findAll.mockRejectedValue(errorMessage);

            req = mockRequest();
            await getAll(req, res);

            // Verifica se o status HTTP foi 400
            expect(res.status).toHaveBeenCalledWith(400);
            // Verifica a mensagem de erro padrão
            expect(res.json).toHaveBeenCalledWith({ message: 'Não foi possível buscar todos os alunos.' });
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: postStudent
    // ====================================================================
    describe('postStudent', () => {
        const studentData = {
            name: 'Novo Aluno',
            email: 'novo@email.com',
            rgm: '123456',
            current_semester: '7 Semestre'
        };
        const creator = { id: 99, position: 'Preceptor' };
        
        it('deve retornar 200 e o aluno criado se o cadastro for bem-sucedido', async () => {
            const newStudent = { id_student: 10, ...studentData, created_by_user_id: 99 };
            // Simula que o serviço criou o aluno
            StudentService.create.mockResolvedValue(newStudent);

            req = mockRequest(studentData, creator);
            await postStudent(req, res);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(StudentService.create).toHaveBeenCalledWith(studentData, creator.id, creator.position);
            // Verifica se o status HTTP foi 200
            expect(res.status).toHaveBeenCalledWith(200);
            // Verifica se o objeto do novo aluno foi retornado
            expect(res.json).toHaveBeenCalledWith(newStudent);
        });

        it('deve retornar 404 se o serviço falhar (ex: RGM já existe)', async () => {
            const errorMessage = new Error('RGM já cadastrado');
            // Simula que o serviço falhou
            StudentService.create.mockRejectedValue(errorMessage);

            req = mockRequest(studentData, creator);
            await postStudent(req, res);

            // Verifica se o status HTTP foi 404
            expect(res.status).toHaveBeenCalledWith(404);
            // Verifica a mensagem de erro padrão
            expect(res.json).toHaveBeenCalledWith({ message: 'Não foi possível criar o usuário.' });
        });
    });
});