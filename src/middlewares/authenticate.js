// Middleware de autenticación JWT para backend de Teacher
// Verifica que el usuario tenga un token válido

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Extraer token del header Authorization
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticación requerido. Por favor inicia sesión.'
        });
    }

    try {
        // Verificar el token usando el mismo JWT_SECRET que auth_gradia
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Guardar información del usuario en la request
        req.user = {
            id: payload.sub,
            email: payload.email
        };

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Por favor inicia sesión nuevamente.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token inválido. Acceso denegado.'
        });
    }
};

module.exports = authenticate;
