const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token requerido');
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Token inválido');
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;