const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // verificar si viene el token
        if (!authHeader) {
            return res.status(401).json({ mensaje: 'Token requerido' });
        }

        // "Bearer TOKEN"
        const token = authHeader.split(' ')[1];

        // verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // guardar info del usuario en la request
        req.usuario = decoded;

        next(); 

    } catch (error) {
        return res.status(403).json({ mensaje: 'Token inválido' });
    }
};

module.exports = authMiddleware;