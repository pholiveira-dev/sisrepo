// 1. Configuração do Mock para o Knex
// Criamos um objeto de simulação (mockQueryBuilder) que representa o construtor de consultas do Knex.
// A maioria dos métodos do Knex são encadeáveis, então usamos .mockReturnThis() para simular esse encadeamento.
const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    del: jest.fn(),
    returning: jest.fn(),
};

// O mock principal para a função 'knex' (o require('../../knex')).
// Foi renomeado para 'mockKnex' para evitar o erro de ReferenceError do Jest.
const mockKnex = jest.fn(() => mockQueryBuilder);

// 2. Simula o módulo Knex (ajustando o caminho conforme seu log de erro)
// Agora usando 'mockKnex' na função de fábrica.
jest.mock('../../knex', () => mockKnex);

// 3. Importa o Model (ajustando o caminho conforme seu log de erro)
const ReplacementsModel = require('../../models/ReplacementsModel');

// Constante para o nome da tabela (para verificar se o Knex é chamado corretamente)
const TABLE_NAME = 'replacements';

describe('ReplacementsModel', () => {

    // Antes de cada teste, limpamos todas as chamadas de mock para garantir o isolamento
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findById(id_replacement)
    // ====================================================================
    describe('findById', () => {
        const mockReplacement = { id_replacement: 1, justification: 'Mocked Data' };
        const replacementId = 1;

        it('deve chamar o Knex com a tabela correta e buscar o primeiro registro por ID', async () => {
            // Mock do valor que o método final 'first()' deve retornar
            mockQueryBuilder.first.mockResolvedValue(mockReplacement);

            const result = await ReplacementsModel.findById(replacementId);

            // 1. Verifica se a função mockKnex foi chamada com o nome da tabela
            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            // 2. Verifica se o método where foi chamado com o ID correto
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_replacement: replacementId });
            // 3. Verifica se o método final first() foi chamado
            expect(mockQueryBuilder.first).toHaveBeenCalledTimes(1);
            // 4. Verifica o valor retornado pelo Model
            expect(result).toEqual(mockReplacement);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: findAll()
    // ====================================================================
    describe('findAll', () => {
        const mockReplacements = [
            { id_replacement: 1, justification: 'A', is_present: true },
            { id_replacement: 2, justification: 'B', is_present: false }
        ];

        it('deve chamar o Knex com a tabela correta e selecionar os campos esperados', async () => {
            // Mock do valor que o método encadeado '.select()....' deve retornar
            mockQueryBuilder.select.mockResolvedValue(mockReplacements);

            const result = await ReplacementsModel.findAll();

            // 1. Verifica se a função mockKnex foi chamada
            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            // 2. Verifica se os campos corretos foram selecionados
            expect(mockQueryBuilder.select).toHaveBeenCalledWith(
                'id_replacement',
                'justification',
                'is_present',
                'preceptor_add_by',
                'schedule_at'
            );
            // 3. Verifica o valor retornado
            expect(result).toEqual(mockReplacements);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: create(replacementData)
    // ====================================================================
    describe('create', () => {
        const replacementData = {
            student_id: 5,
            justification: 'Faltou por compromisso',
            preceptor_add_by: 99
        };
        const newReplacement = { id_replacement: 10, ...replacementData };

        it('deve inserir os dados e retornar os campos do novo registro', async () => {
            // Mock do valor que o método final 'returning()' deve retornar ([newReplacement])
            mockQueryBuilder.returning.mockResolvedValue([newReplacement]);

            const result = await ReplacementsModel.create(replacementData);

            // 1. Verifica se a função mockKnex foi chamada
            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            // 2. Verifica se o método insert foi chamado com os dados corretos
            expect(mockQueryBuilder.insert).toHaveBeenCalledWith(replacementData);
            // 3. Verifica se os campos de retorno foram solicitados
            expect(mockQueryBuilder.returning).toHaveBeenCalledWith(
                'id_replacement',
                'justification',
                'is_present',
                'preceptor_add_by',
                'schedule_at'
            );
            // 4. Verifica se o valor retornado é o objeto único (o primeiro elemento do array retornado)
            expect(result).toEqual(newReplacement);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: update(id_replacement, replacementData)
    // ====================================================================
    describe('update', () => {
        const replacementId = 10;
        const updateData = { justification: 'Novo motivo', is_present: true };
        const updatedReplacement = { id_replacement: replacementId, ...updateData };

        it('deve encontrar por ID, atualizar os dados e retornar o registro atualizado', async () => {
            // Mock do valor que o método final 'returning()' deve retornar ([updatedReplacement])
            mockQueryBuilder.returning.mockResolvedValue([updatedReplacement]);

            const result = await ReplacementsModel.update(replacementId, updateData);

            // 1. Verifica se a função mockKnex foi chamada
            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            // 2. Verifica se a busca por ID foi feita antes do update
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_replacement: replacementId });
            // 3. Verifica se o método update foi chamado com os dados
            expect(mockQueryBuilder.update).toHaveBeenCalledWith(updateData);
            // 4. Verifica se os campos de retorno foram solicitados
            expect(mockQueryBuilder.returning).toHaveBeenCalledWith(
                'id_replacement',
                'justification',
                'is_present',
                'preceptor_add_by',
                'schedule_at'
            );
            // 5. Verifica se o valor retornado é o objeto único atualizado
            expect(result).toEqual(updatedReplacement);
        });
    });

    // ====================================================================
    // TESTES PARA A FUNÇÃO: delete(id_replacement)
    // ====================================================================
    describe('delete', () => {
        const replacementId = 20;
        // Knex .del() retorna a contagem de linhas excluídas (1 se for bem-sucedido)
        const mockDeleteCount = 1;

        it('deve chamar o Knex para deletar o registro pelo ID', async () => {
            // Mock do valor que o método final 'del()' deve retornar
            mockQueryBuilder.del.mockResolvedValue(mockDeleteCount);

            const result = await ReplacementsModel.delete(replacementId);

            // 1. Verifica se a função mockKnex foi chamada
            expect(mockKnex).toHaveBeenCalledWith(TABLE_NAME);
            // 2. Verifica se a busca por ID foi feita antes do delete
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id_replacement: replacementId });
            // 3. Verifica se o método del() foi chamado
            expect(mockQueryBuilder.del).toHaveBeenCalledTimes(1);
            // 4. Verifica o resultado da exclusão (geralmente a contagem de linhas)
            expect(result).toBe(mockDeleteCount);
        });
    });
});
