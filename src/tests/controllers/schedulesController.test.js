// schedulesController.test.js

// 1. Simulação do módulo Knex (Se ele for importado em algum lugar que o Controller chama)
// Embora o controller só chame o Service, é bom ter este mock se o Knex estiver em um path que o Jest procura.
jest.mock('../../knex', () => ({
    raw: jest.fn().mockResolvedValue(null),
    select: jest.fn().mockReturnThis(),
}));

// 2. Garante o carregamento das variáveis de ambiente
require('dotenv').config();

// 3. Simula o módulo SchedulesService
// IMPORTANTE: A simulação de um módulo deve vir antes do seu 'require'.
// CORREÇÃO: Usando o caminho correto para o SchedulesService e nomeando a variável corretamente.
jest.mock('../../services/SchedulesService'); 
const SchedulesService = require('../../services/SchedulesService');

// 4. Importa o Controller (que agora usa os módulos simulados)
// CORREÇÃO: Usando o caminho correto para o SchedulesController e corrigindo o typo 'rrequire'.
const { getAll, getSchedule, postSchedule, putSchedule, delSchedule } = require('../../controllers/schedulesController');

4
// Simulação de objetos Express: Request (req) e Response (res)
// Adaptação para incluir params e user, essenciais para este controller
const mockRequest = ({ params = {}, body = {}, user = {} } = {}) => ({
    params,
    body,
    user,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    // res.send = jest.fn().mockReturnValue(res); // Não usado neste controller, mas pode ser útil
    return res;
};

// --- Início dos Testes ---

describe('SchedulesController', () => {
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
        it('deve retornar 200 e todos os agendamentos se a busca for bem-sucedida', async () => {
            const mockSchedules = [{ id_schedule: 1, shift: 'Manhã' }];
            // Simula que o serviço encontrou agendamentos
            SchedulesService.findAll.mockResolvedValue(mockSchedules);

            req = mockRequest();
            await getAll(req, res);

            expect(SchedulesService.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSchedules);
        });

        it('deve retornar 500 se o serviço falhar', async () => {
            const errorMessage = new Error('Database connection failure.');
            // Simula que o serviço falhou
            SchedulesService.findAll.mockRejectedValue(errorMessage);

            req = mockRequest();
            await getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor ao tentar encontrar todos os agendamentos.' });
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: getSchedule (Busca por ID)
    // ====================================================================
    describe('getSchedule', () => {
        const scheduleId = 10;

        it('deve retornar 200 e o agendamento se a busca for bem-sucedida', async () => {
            const mockSchedule = { id_schedule: scheduleId, shift: 'Tarde' };
            SchedulesService.findById.mockResolvedValue(mockSchedule);

            req = mockRequest({ params: { id_schedule: scheduleId } });
            await getSchedule(req, res);

            expect(SchedulesService.findById).toHaveBeenCalledWith(scheduleId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSchedule);
        });

        it('deve retornar 404 se o agendamento não for encontrado', async () => {
            // Simula que o serviço retornou null (não encontrou)
            SchedulesService.findById.mockResolvedValue(null);

            req = mockRequest({ params: { id_schedule: scheduleId } });
            await getSchedule(req, res);

            expect(SchedulesService.findById).toHaveBeenCalledWith(scheduleId);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Agendamento não encontrado no sistema.' });
        });

        it('deve retornar 500 se o serviço falhar', async () => {
            const errorMessage = new Error('Database query failure.');
            SchedulesService.findById.mockRejectedValue(errorMessage);

            req = mockRequest({ params: { id_schedule: scheduleId } });
            await getSchedule(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor ao buscar o agendamento.' });
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: postSchedule (Criação)
    // ====================================================================
    describe('postSchedule', () => {
        const scheduleInput = {
            schedule_date: '2025-12-25',
            shift: 'Manhã',
            max_capacity: 50
        };
        const creator = { id_user: 99 };
        
        it('deve retornar 201 e o agendamento criado se o cadastro for bem-sucedido', async () => {
            const newSchedule = { id_schedule: 10, ...scheduleInput, created_by_user_id: creator.id_user };
            SchedulesService.create.mockResolvedValue(newSchedule);

            req = mockRequest({ body: scheduleInput, user: creator });
            await postSchedule(req, res);

            // Verifica se o serviço foi chamado com os dados corretos, incluindo o id_user
            expect(SchedulesService.create).toHaveBeenCalledWith({ 
                ...scheduleInput, 
                created_by_user_id: creator.id_user 
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newSchedule);
        });

        it('deve retornar 401 se o usuário não estiver autenticado (id_user faltante)', async () => {
            req = mockRequest({ body: scheduleInput, user: { id_user: null } }); // Simulando id_user nulo
            await postSchedule(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não autenticado ou token inválido.' });
            expect(SchedulesService.create).not.toHaveBeenCalled();
        });

        it('deve retornar 400 se campos obrigatórios estiverem faltando', async () => {
            const invalidInput = { schedule_date: '2025-12-25', shift: 'Manhã' }; // Falta max_capacity
            req = mockRequest({ body: invalidInput, user: creator });
            await postSchedule(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Todos os campos de agendamento (data, turno e capacidade) são obrigatórios.' });
            expect(SchedulesService.create).not.toHaveBeenCalled();
        });

        it('deve retornar 500 se o serviço falhar (ex: erro de banco de dados)', async () => {
            const errorMessage = new Error('Database constraint violation.');
            SchedulesService.create.mockRejectedValue(errorMessage);

            req = mockRequest({ body: scheduleInput, user: creator });
            await postSchedule(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor ao criar o agendamento.' });
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: putSchedule (Atualização)
    // ====================================================================
    describe('putSchedule', () => {
        const scheduleId = 10;
        const updateInput = { shift: 'Noite', max_capacity: 40 };

        it('deve retornar 200 e o agendamento atualizado se for bem-sucedido', async () => {
            const updatedSchedule = { id_schedule: scheduleId, schedule_date: '2025-12-25', ...updateInput };
            SchedulesService.update.mockResolvedValue(updatedSchedule);

            req = mockRequest({ params: { id_schedule: scheduleId }, body: updateInput });
            await putSchedule(req, res);

            expect(SchedulesService.update).toHaveBeenCalledWith(scheduleId, updateInput);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedSchedule);
        });

        it('deve retornar 404 se o id_schedule não for fornecido nos params', async () => {
            req = mockRequest({ params: { id_schedule: null }, body: updateInput });
            await putSchedule(req, res);

            // Mantendo o status 404 para erro de parâmetro conforme a implementação original do teste
            expect(res.status).toHaveBeenCalledWith(404); 
            expect(res.json).toHaveBeenCalledWith({ message: 'id_schedule não informado.' });
            expect(SchedulesService.update).not.toHaveBeenCalled();
        });

        it('deve retornar 400 se nenhum campo para atualização for fornecido no body', async () => {
            req = mockRequest({ params: { id_schedule: scheduleId }, body: {} });
            await putSchedule(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Pelo menos um campo deve ser fornecido.' });
            expect(SchedulesService.update).not.toHaveBeenCalled();
        });

        it('deve retornar 404 se o agendamento não for encontrado para atualização', async () => {
            SchedulesService.update.mockResolvedValue(null);

            req = mockRequest({ params: { id_schedule: scheduleId }, body: updateInput });
            await putSchedule(req, res);

            expect(SchedulesService.update).toHaveBeenCalledWith(scheduleId, updateInput);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: `Agendamento com ID ${scheduleId} não encontrado para atualização.` });
        });

        it('deve retornar 500 se o serviço falhar', async () => {
            const errorMessage = new Error('Database write error.');
            SchedulesService.update.mockRejectedValue(errorMessage);

            req = mockRequest({ params: { id_schedule: scheduleId }, body: updateInput });
            await putSchedule(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor ao atualizar o agendamento.' });
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: delSchedule (Exclusão)
    // ====================================================================
    describe('delSchedule', () => {
        const scheduleId = 10;

        it('deve retornar 200 e o agendamento excluído se for bem-sucedido', async () => {
            const deletedSchedule = { id_schedule: scheduleId, shift: 'Manhã', deleted: true };
            SchedulesService.delete.mockResolvedValue(deletedSchedule);

            req = mockRequest({ params: { id_schedule: scheduleId } });
            await delSchedule(req, res);

            expect(SchedulesService.delete).toHaveBeenCalledWith(scheduleId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deletedSchedule);
        });

        it('deve retornar 400 se o id_schedule não for fornecido nos params', async () => {
            req = mockRequest({ params: {} });
            await delSchedule(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Não foi possível encontrar o id_schedule.' });
            expect(SchedulesService.delete).not.toHaveBeenCalled();
        });

        it('deve retornar 404 se o agendamento não for encontrado para exclusão', async () => {
            SchedulesService.delete.mockResolvedValue(null);

            req = mockRequest({ params: { id_schedule: scheduleId } });
            await delSchedule(req, res);

            expect(SchedulesService.delete).toHaveBeenCalledWith(scheduleId);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: `Agendamento com ID ${scheduleId} não encontrado para exclusão.` });
        });

        it('deve retornar 500 se o serviço falhar', async () => {
            const errorMessage = new Error('Database deletion error.');
            SchedulesService.delete.mockRejectedValue(errorMessage);

            req = mockRequest({ params: { id_schedule: scheduleId } });
            await delSchedule(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor ao tentar deletar o agendamento.' });
        });
    });
});
