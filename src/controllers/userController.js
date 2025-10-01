const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        }

        const user = await UserService.authenticate(email, password);

        // CRIAÇÃO DO TOKEN JWT

        const token = jwt.sign(
            {id: user.id_user, position: user.position},
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({ user, token });

    } catch (error) {
        if (error.message.includes('incorretos')) {
            return res.status(401).json({ message: error.message });
        }

        return res.status(500).json({ message: 'Falha interna ao tentar fazer login' })
    }
}

async function getId(req, res) {
    try {
        const { id_user } = req.params;

        const user = await UserService.findById(id_user);

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'ID do usuário não encontrado.' })
    }
}

async function getAll(req, res) {
    try {

        const findAll = await UserService.findAll();

        return res.status(200).json(findAll);

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Não foi possível encontrar os usuários' })
    }
}

async function postUser(req, res) {
    try {
        const { name, email, password, position } = req.body;

        const userData =  { name, email, password, position };

        const newUser = await UserService.create(userData)

        return res.status(201).json(newUser);

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Não foi possível criar o usuário!' })
    }
}

async function putUser(req, res) {

    try {

    const { id_user } = req.params;
    const { name, email, password, position } = req.body;

    if(!id_user) {
        return res.status(400).json({ message: 'ID do usuário não encontrado' })
    }

    const userData = {};

    if(name) userData.name = name;
    if(email) userData.email = email;
    if(password) userData.password = password;
    if(position) userData.position = position;

    if(Object.keys(userData).length === 0) {
        return res.status(400).json({ message: 'Pelo menos um campo (nome, email, senha ou posição) devem ser fornecidos.' })
    }

    const  update  = await UserService.update(id_user, userData);

        return res.status(200).json(update);

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Não foi possível atualizar o usuário' });
    }

}

module.exports = {
    getId,
    getAll,
    postUser,
    putUser,
    loginUser,
};