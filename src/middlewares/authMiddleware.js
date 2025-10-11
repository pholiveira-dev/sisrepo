const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({ message: 'Acesso negado: Token não fornecido.' });
    }

    const [scheme, token] = authHeader.split(' ');

    if(!/^Bearer$/i.test(scheme) || !token) {
        return res.status(401).json({ message: 'Formato de token inválido.' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            id_user: decoded.id,
            position: decoded.position
        };

        return next()

    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' })
    }
}