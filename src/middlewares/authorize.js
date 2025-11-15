// Middleware de autorización por roles para backend de Teacher
// Verifica que el usuario tenga el rol requerido (DOCENTE o ADMIN)

const { sequelize } = require('../config/database');

/**
 * Middleware de autorización por rol
 * @param {string|string[]} allowedRoles - Rol o roles permitidos (ej: 'DOCENTE' o ['DOCENTE', 'ADMIN'])
 */
const authorize = (allowedRoles) => {
    // Convertir a array si es un string
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    return async (req, res, next) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Usuario no autenticado.'
                });
            }

            // Consultar roles del usuario directamente en la base de datos
            const query = `
                SELECT r.nombre_rol
                FROM mantenimiento_usuarios.usuario_rol ur
                INNER JOIN mantenimiento_usuarios.rol r ON ur.id_rol = r.id_rol
                WHERE ur.id_usuario = :userId AND r.estado = 'ACTIVO'
            `;

            const [userRoles] = await sequelize.query(query, {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            });

            if (!userRoles || userRoles.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. No tienes los permisos necesarios.'
                });
            }

            // Extraer nombres de roles
            const userRoleNames = userRoles.map(r => r.nombre_rol);

            // Verificar si el usuario tiene alguno de los roles permitidos
            const hasPermission = roles.some(role => userRoleNames.includes(role));

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`
                });
            }

            // Guardar roles del usuario en la request
            req.user.roles = userRoleNames;

            next();
        } catch (error) {
            console.error('Error en middleware de autorización:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al verificar permisos.'
            });
        }
    };
};

module.exports = authorize;
