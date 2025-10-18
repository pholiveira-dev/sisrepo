// Mockamos o bcrypt (CRÍTICO para autenticação)
const bcrypt = require('bcrypt');
jest.mock('bcrypt');

// --- Configuração do Mock do UserRepository ---
const mockUserRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
};

// 1. Simula o módulo UserRepository
jest.mock('../../repositories/UserRepository', () => mockUserRepository);

// Carregamos o Service após os mocks
const UserService = require('../../services/UserService');

describe('UserService', () => {

    // Espia (spy on) o método findByEmail do próprio Service 
    // para testar 'authenticate' e 'create' que chamam 'this.findByEmail' internamente.
    let findByEmailSpy;

    beforeAll(() => {
        // Criamos o spy antes de todos os testes
        findByEmailSpy = jest.spyOn(UserService, 'findByEmail');
    });

    afterAll(() => {
        // Restauramos o método original após todos os testes
        findByEmailSpy.mockRestore();
    });

    beforeEach(() => {
        // Limpa todos os mocks e spies antes de cada teste
        jest.clearAllMocks();
        findByEmailSpy.mockClear();
    });

    // ====================================================================
    // TESTES DE LÓGICA DE NEGÓCIO - AUTHENTICATE
    // ====================================================================

    describe('authenticate', () => {
        const testEmail = 'user@test.com';
        const testPassword = 'senhaSegura123';
        const hashedPassword = 'hashed_password_from_db';
        const mockUser = { id_user: 1, email: testEmail, password: hashedPassword, position: 'admin' };
        
        // Mockamos o método findByEmail para retornar o usuário existente
        const setupSuccess = () => {
            findByEmailSpy.mockResolvedValue(mockUser);
            // Mockamos o bcrypt.compare para simular que a senha bate
            bcrypt.compare.mockResolvedValue(true); 
        };

        it('deve autenticar com sucesso e remover a senha do objeto retornado', async () => {
            setupSuccess();

            const result = await UserService.authenticate(testEmail, testPassword);

            // Verifica se findByEmail foi chamado
            expect(findByEmailSpy).toHaveBeenCalledWith(testEmail);
            // Verifica se bcrypt.compare foi chamado corretamente
            expect(bcrypt.compare).toHaveBeenCalledWith(testPassword, hashedPassword);
            // Verifica se a senha foi removida do objeto de retorno
            expect(result).toEqual({ id_user: 1, email: testEmail, position: 'admin' });
            expect(result.password).toBeUndefined();
        });

        it('deve lançar erro se o e-mail não for encontrado', async () => {
            // Mockamos o findByEmail para retornar null
            findByEmailSpy.mockResolvedValue(null);

            await expect(UserService.authenticate(testEmail, testPassword)).rejects.toThrow(
                'E-mail e/ou senha incorretos.'
            );

            expect(findByEmailSpy).toHaveBeenCalledWith(testEmail);
            // O compare NÃO deve ser chamado se o usuário não for encontrado
            expect(bcrypt.compare).not.toHaveBeenCalled(); 
        });

        it('deve lançar erro se a senha não coincidir', async () => {
            // Mockamos o findByEmail para retornar o usuário
            findByEmailSpy.mockResolvedValue(mockUser);
            // Mockamos o bcrypt.compare para simular que a senha não bate
            bcrypt.compare.mockResolvedValue(false);

            await expect(UserService.authenticate(testEmail, testPassword)).rejects.toThrow(
                'E-mail e/ou senha incorretos.'
            );

            expect(findByEmailSpy).toHaveBeenCalledWith(testEmail);
            expect(bcrypt.compare).toHaveBeenCalledWith(testPassword, hashedPassword);
        });
    });

    // ====================================================================
    // TESTES DE LÓGICA DE NEGÓCIO - CREATE
    // ====================================================================

    describe('create', () => {
        const userDataInput = { name: 'Novo User', email: 'new@mail.com', password: 'securePassword' };
        const mockHashedPassword = 'a_new_hashed_password';
        const dataToSaveExpected = { name: 'Novo User', email: 'new@mail.com', password: mockHashedPassword };
        const expectedResult = { id_user: 2, ...dataToSaveExpected };

        beforeEach(() => {
            // Mockamos o bcrypt.hash para retornar o hash simulado
            bcrypt.hash.mockResolvedValue(mockHashedPassword);
            // Mockamos o UserRepository.create
            mockUserRepository.create.mockResolvedValue(expectedResult);
        });

        it('deve criar o usuário, hashear a senha e chamar o Repositório', async () => {
            // Configuração para sucesso: E-mail não existe
            findByEmailSpy.mockResolvedValue(null); 

            const result = await UserService.create(userDataInput);

            // Verifica se a checagem de e-mail foi feita
            expect(findByEmailSpy).toHaveBeenCalledWith(userDataInput.email);
            // Verifica se bcrypt.hash foi chamado
            expect(bcrypt.hash).toHaveBeenCalledWith(userDataInput.password, 10);
            // Verifica se UserRepository.create foi chamado com o hash e o payload correto
            expect(mockUserRepository.create).toHaveBeenCalledWith(dataToSaveExpected);
            expect(result).toEqual(expectedResult);
        });

        it('deve lançar erro se o e-mail já estiver cadastrado', async () => {
            // Configuração para falha: E-mail já existe
            findByEmailSpy.mockResolvedValue({ id_user: 1, email: userDataInput.email });

            await expect(UserService.create(userDataInput)).rejects.toThrow(
                'Este e-mail já está cadastrado.'
            );
            
            // A checagem de e-mail deve ocorrer
            expect(findByEmailSpy).toHaveBeenCalledWith(userDataInput.email);
            // O hash e a criação NÃO devem ocorrer
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });
    });

    // ====================================================================
    // TESTES DE LÓGICA DE NEGÓCIO - UPDATE
    // ====================================================================

    describe('update', () => {
        const idUser = 1;
        const passwordUpdate = { password: 'newSecurePassword' };
        const otherUpdate = { name: 'Updated Name' };
        const mockHashedPassword = 'new_hashed_password';
        const expectedResult = { id_user: 1, name: 'Updated Name' };

        beforeEach(() => {
            bcrypt.hash.mockResolvedValue(mockHashedPassword);
            mockUserRepository.update.mockResolvedValue(expectedResult);
        });

        it('deve hashear a senha antes de chamar o Repositório se a senha for fornecida', async () => {
            const dataWithPassword = { ...otherUpdate, ...passwordUpdate };
            const expectedPayload = { ...otherUpdate, password: mockHashedPassword };

            await UserService.update(idUser, dataWithPassword);

            // Verifica se bcrypt.hash foi chamado
            expect(bcrypt.hash).toHaveBeenCalledWith(passwordUpdate.password, 10);
            // Verifica se UserRepository.update foi chamado com o hash
            expect(mockUserRepository.update).toHaveBeenCalledWith(idUser, expectedPayload);
        });

        it('NÃO deve hashear a senha se a senha NÃO for fornecida', async () => {
            const dataWithoutPassword = otherUpdate;

            await UserService.update(idUser, dataWithoutPassword);

            // Verifica se bcrypt.hash NÃO foi chamado
            expect(bcrypt.hash).not.toHaveBeenCalled();
            // Verifica se UserRepository.update foi chamado com os dados originais
            expect(mockUserRepository.update).toHaveBeenCalledWith(idUser, dataWithoutPassword);
        });
    });

    // ====================================================================
    // TESTES DE DELEGAÇÃO (FIND / DELETE)
    // ====================================================================

    describe('Delegação dos demais métodos', () => {

    beforeAll(() => {
        // Restaura a implementação original do método findByEmail
        findByEmailSpy.mockRestore();
    });        

        // A remoção da lógica complexa de beforeAll/afterAll deve permitir que o
        // teste de delegação do findByEmail utilize a implementação real do Service
        // para chamar o Repositório mockado.

        it('findById deve delegar para o Repositório', async () => {
            const id = 1;
            mockUserRepository.findById.mockResolvedValue({});
            await UserService.findById(id);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(id);
        });

        it('findAll deve delegar para o Repositório', async () => {
            mockUserRepository.findAll.mockResolvedValue([]);
            await UserService.findAll();
            expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it('delete deve delegar para o Repositório', async () => {
            const id = 3;
            mockUserRepository.delete.mockResolvedValue(1);
            await UserService.delete(id);
            expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
        });

        it('findByEmail deve delegar para o Repositório', async () => {
            const email = 'user@test.com';
            mockUserRepository.findByEmail.mockResolvedValue({});
            await UserService.findByEmail(email);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
        });
    });
});
