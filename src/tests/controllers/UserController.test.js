// tests/controllers/UserController.test.js
const jwt = require('jsonwebtoken');
const UserService = require('../../services/UserService');
const { loginUser } = require('../../controllers/userController');

// Simula o JWT_SECRET para o teste
process.env.JWT_SECRET = 'fake_secret_key';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake-jwt-token')
}));

jest.mock('../../services/UserService', () => ({
  authenticate: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));


describe('UserController - loginUser', () => {
  let req, res;

  beforeEach(() => {
    // Mock de request e response do Express
    req = {
      body: { email: 'test@example.com', password: '123456' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar erro 400 se email ou senha estiverem ausentes', async () => {
    req.body = {}; // sem email e senha
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'E-mail e senha são obrigatórios.' });
  });

  test('deve retornar token JWT e dados do usuário válidos', async () => {
    // simula o retorno do UserService.authenticate
    const fakeUser = { id_user: 1, position: 'preceptor' };
    jest.spyOn(UserService, 'authenticate').mockResolvedValue(fakeUser);

    await loginUser(req, res);

    expect(UserService.authenticate).toHaveBeenCalledWith('test@example.com', '123456');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: fakeUser,
      token: expect.any(String) // o token é uma string
    });
  });

  test('deve retornar 401 se credenciais forem inválidas', async () => {
    jest.spyOn(UserService, 'authenticate').mockRejectedValue(new Error('E-mail ou senha incorretos.'));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'E-mail ou senha incorretos.' });
  });

  test('deve retornar 500 em erro interno inesperado', async () => {
    jest.spyOn(UserService, 'authenticate').mockRejectedValue(new Error('Falha desconhecida'));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Falha interna ao tentar fazer login' });
  });
});
