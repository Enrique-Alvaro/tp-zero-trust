const connection = require('../config/db');
const logAuditoria = require('../utils/logAuditoria');

const getLogs = (req, res) => {
  console.log("📜 Ejecutando getLogs");
  connection.query('SELECT * FROM auditoria', (err, results) => {
    if (err) {
      console.error('Error al obtener logs:', err);
      return res.status(500).json({ message: 'Error al obtener logs' });
    }
    res.json(results);
  });
};

const getUsers = (req, res) => {
  console.log("👤 Ejecutando getUsers");
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ message: 'Error al obtener usuarios' });
    }
    res.json(results);
  });
};

module.exports = { getLogs, getUsers };
