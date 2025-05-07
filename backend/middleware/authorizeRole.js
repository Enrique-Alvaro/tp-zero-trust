// middleware/authorizeRole.js
const logAuditoria = require('./utils/logAuditoria');
module.exports = function (requiredRole) {
    return async(req, res, next) => {
      const user = req.user; // viene desde verifyToken
  
      if (!user || user.role !== requiredRole) {
        await logAuditoria(
          user?.id ?? null,
          'Acceso denegado',
          `Usuario ${user?.username ?? 'desconocido'} intentó acceder como ${requiredRole}`,
          user?.username ?? 'N/A'
        );
        return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
      }
      await logAuditoria(
        user.id,
        'Acceso autorizado',
        `Usuario ${user.username} accedió correctamente con el rol ${requiredRole}`,
        user.username
      );
      next();
    };
  };
  