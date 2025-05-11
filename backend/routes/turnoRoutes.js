const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Obtener médicos (visible solo para pacientes)
router.get('/medicos', authenticateToken, authorizeRoles('paciente'), (req, res) => {
  const query = "SELECT id, username, email FROM users WHERE role = 'medico'";
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener médicos:', err);
      return res.status(500).json({ message: 'Error al obtener médicos' });
    }
    res.json(results);
  });
});

// Solicitar turno (paciente)
router.post('/solicitar', authenticateToken, authorizeRoles('paciente'), (req, res) => {
  const { nombre, fecha } = req.body;

  if (!nombre || !fecha) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  const query = `INSERT INTO turno (nombre, fecha) VALUES (?, ?)`;
  connection.query(query, [nombre, fecha], (err, result) => {
    if (err) {
      console.error('Error al guardar el turno:', err);
      return res.status(500).json({ message: 'Error al solicitar el turno' });
    }

    res.status(201).json({ message: 'Turno solicitado con éxito' });
  });
});

module.exports = router;
