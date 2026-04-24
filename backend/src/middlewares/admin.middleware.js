module.exports = (req, res, next) => {
    if (req.user && req.user.rol === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
};