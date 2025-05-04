// middleware/authorizeRole.js
module.exports = function (requiredRole) {
    return (req, res, next) => {
      const user = req.user; // viene desde verifyToken
  
      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
      }
  
      next();
    };
  };
  