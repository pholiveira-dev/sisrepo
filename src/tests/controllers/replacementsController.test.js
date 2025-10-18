// schedulesController.test.js

// 1. Simulação do módulo Knex (Pode ser removido se não houver uso direto/indireto)
jest.mock('../../knex', () => ({
    raw: jest.fn().mockResolvedValue(null),
    select: jest.fn().mockReturnThis(),
}));

// 2. Garante o carregamento das variáveis de ambiente (se necessário)
require('dotenv').config();

// 3. Simula o módulo ReplacementsService
// IMPORTANTE: A simulação de um módulo deve vir antes do seu 'require'.
jest.mock('../../services/ReplacementsService');
const ReplacementsService = require('../../services/ReplacementsService');

// 4. Importa o Controller (que agora usa os módulos simulados)
const { getAll, getById, postReplacement, putReplacement, deleteReplacement } = require('../../controllers/replacementsController');


// Simulação de objetos Express: Request (req) e Response (res)
const mockRequest = ({ params = {}, body = {}, user = {} } = {}) => ({
    params,
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

describe('ReplacementsController', () => {
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
        it('deve retornar 200 e todas as reposições se a busca for bem-sucedida', async () => {
            const mockReplacements = [{ id: 1, justification: 'Atraso' }];
            ReplacementsService.findAll.mockResolvedValue(mockReplacements);

            req = mockRequest();
            await getAll(req, res);

            expect(ReplacementsService.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReplacements);
        });

        it('deve retornar 404 se o serviço falhar (sem registros)', async () => {
            const errorMessage = new Error('Database connection failure.');
            ReplacementsService.findAll.mockRejectedValue(errorMessage);

            req = mockRequest();
            await getAll(req, res);

            // O controller retorna 404 no catch
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Sem registro no sistema.' });
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: getById (Busca por ID)
    // ====================================================================
    describe('getById', () => {
        const replacementId = 42;

        it('deve retornar 200 e a reposição se a busca for bem-sucedida', async () => {
            const mockReplacement = { id_replacement: replacementId, student_id: 5 };
            ReplacementsService.findById.mockResolvedValue(mockReplacement);

            req = mockRequest({ params: { id_replacement: replacementId } });
            await getById(req, res);

            expect(ReplacementsService.findById).toHaveBeenCalledWith(replacementId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReplacement);
        });

        it('deve retornar 404 se o ID não for fornecido', async () => {
            req = mockRequest({ params: {} });
            await getById(req, res);

            expect(ReplacementsService.findById).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'ID do agendamento não encontrado.' });
        });

        it('deve retornar 404 se a reposição não for encontrada', async () => {
            ReplacementsService.findById.mockResolvedValue(null);

            req = mockRequest({ params: { id_replacement: replacementId } });
            await getById(req, res);

            expect(ReplacementsService.findById).toHaveBeenCalledWith(replacementId);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Reposição não encontrada no banco de dados.' });
        });

        it('deve retornar 500 se o serviço falhar', async () => {
            const errorMessage = new Error('Database query failure.');
            ReplacementsService.findById.mockRejectedValue(errorMessage);

            req = mockRequest({ params: { id_replacement: replacementId } });
            await getById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Não foi possível encontrar a reposição.' });
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: postReplacement (Criação)
    // ====================================================================
    describe('postReplacement', () => {
        const creator = { id_user: 99 };
        const replacementInput = {
            student_id: 1,
            schedule_id: 10,
            justification: 'Faltou por doença',
            is_present: false,
            schedule_at: '2025-10-20T14:00:00Z'
        };

        it('deve retornar 201 e a reposição criada se o cadastro for bem-sucedido', async () => {
            const newReplacement = { id_replacement: 100, ...replacementInput, preceptor_add_by: creator.id_user };
            ReplacementsService.create.mockResolvedValue(newReplacement);

            req = mockRequest({ body: replacementInput, user: creator });
            await postReplacement(req, res);

            const expectedPayload = {
                ...replacementInput,
                preceptor_add_by: creator.id_user
            };

            expect(ReplacementsService.create).toHaveBeenCalledWith(expectedPayload);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newReplacement);
        });

        it('deve retornar 400 se faltarem campos obrigatórios', async () => {
            // Falta schedule_id
            const invalidInput = {
                student_id: 1,
                justification: 'Faltou',
                schedule_at: '2025-10-20T14:00:00Z'
            };
            req = mockRequest({ body: invalidInput, user: creator });
            await postReplacement(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Todos os campos obrigatórios (ID do estudante, ID do agendamento, justificativa e horário) devem ser preenchidos.'
            });
            expect(ReplacementsService.create).not.toHaveBeenCalled();
        });

        it('deve retornar 400 se o id_user não for fornecido', async () => {
            req = mockRequest({ body: replacementInput, user: {} }); // id_user ausente
            await postReplacement(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(ReplacementsService.create).not.toHaveBeenCalled();
        });

        it('deve retornar 404 se o serviço falhar (ex: erro de chave estrangeira)', async () => {
            const errorMessage = new Error('Database constraint violation.');
            ReplacementsService.create.mockRejectedValue(errorMessage);

            req = mockRequest({ body: replacementInput, user: creator });
            await postReplacement(req, res);

            // O controller retorna 404 no catch
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Não foi possível criar o agendamento.' });
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: putReplacement (Atualização)
    // ====================================================================
    describe('putReplacement', () => {
        const replacementId = 50;
        const updateInput = { justification: 'Faltou por compromisso', is_present: true };

        it('deve retornar 200 e a reposição atualizada se for bem-sucedido', async () => {
            const updatedReplacement = { id_replacement: replacementId, ...updateInput };
            ReplacementsService.update.mockResolvedValue(updatedReplacement);

            req = mockRequest({ params: { id_replacement: replacementId }, body: updateInput });
            await putReplacement(req, res);

            expect(ReplacementsService.update).toHaveBeenCalledWith(replacementId, updateInput);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedReplacement);
        });

        it('deve retornar 400 se o id_replacement não for fornecido nos params', async () => {
            req = mockRequest({ params: {}, body: updateInput });
            await putReplacement(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'ID da reposição é obrigatório.' });
            expect(ReplacementsService.update).not.toHaveBeenCalled();
        });

        it('deve retornar 404 se a reposição não for encontrada para atualização', async () => {
            ReplacementsService.update.mockResolvedValue(null);

            req = mockRequest({ params: { id_replacement: replacementId }, body: updateInput });
            await putReplacement(req, res);

            expect(ReplacementsService.update).toHaveBeenCalledWith(replacementId, updateInput);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: `Agendamento com ID ${replacementId} não encontrado para atualização.` });
        });

        it('deve retornar 404 se o serviço falhar', async () => {
            const errorMessage = new Error('Database write error.');
            ReplacementsService.update.mockRejectedValue(errorMessage);

            req = mockRequest({ params: { id_replacement: replacementId }, body: updateInput });
            await putReplacement(req, res);

            // O controller retorna 404 no catch
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar o agendamento.' });
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: deleteReplacement (Exclusão)
    // ====================================================================
    describe('deleteReplacement', () => {
        const replacementId = 60;

        it('deve retornar 200 e a reposição excluída se for bem-sucedido', async () => {
            const deletedReplacement = { id_replacement: replacementId, deleted: true };
            ReplacementsService.delete.mockResolvedValue(deletedReplacement);

            req = mockRequest({ params: { id_replacement: replacementId } });
            await deleteReplacement(req, res);

            expect(ReplacementsService.delete).toHaveBeenCalledWith(replacementId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deletedReplacement);
        });

        it('deve retornar 400 se o id_replacement não for fornecido nos params', async () => {
            req = mockRequest({ params: {} });
            await deleteReplacement(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'ID do agendamento não encontrado.' });
            expect(ReplacementsService.delete).not.toHaveBeenCalled();
        });

        it('deve retornar 404 se a reposição não for encontrada para exclusão', async () => {
            ReplacementsService.delete.mockResolvedValue(null);

            req = mockRequest({ params: { id_replacement: replacementId } });
            await deleteReplacement(req, res);

            expect(ReplacementsService.delete).toHaveBeenCalledWith(replacementId);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Não foi possível excluir o agendamento.' });
        });

        it('deve retornar 500 se o serviço falhar', async () => {
            const errorMessage = new Error('Database deletion error.');
            ReplacementsService.delete.mockRejectedValue(errorMessage);

            req = mockRequest({ params: { id_replacement: replacementId } });
            await deleteReplacement(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor.' });
        });
    });
});
