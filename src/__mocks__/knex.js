// Este arquivo simula o módulo de conexão com o Knex (src/knex.js)
// Ele garante que nenhuma conexão real seja tentada durante o teste.

const mockKnex = {
    // Retorna a si mesmo para encadeamento de métodos, ex: knex('table').select()
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    del: jest.fn().mockReturnThis(),
    
    // Métodos finais que retornam a Promise
    first: jest.fn().mockResolvedValue({}),
    then: jest.fn().mockResolvedValue([]),
    catch: jest.fn().mockReturnThis(),
    
    // Métodos específicos que você está usando
    raw: jest.fn().mockResolvedValue(null), 
};

// O objeto retornado deve ser uma função que simula o knex() ou o objeto de conexão, 
// dependendo de como você exporta em src/knex.js
module.exports = jest.fn(() => mockKnex);