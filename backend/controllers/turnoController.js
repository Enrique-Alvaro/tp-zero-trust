const connection = require('../config/db');

// Obtener todos los turnos
const obtenerTurnos = (req, res) => {
  connection.query('SELECT * FROM turno', (err, results) => {
    if (err) {
      console.error('Error al obtener turnos', err);
      return res.status(500).json({ message: 'Error al obtener turnos' });
    }
    res.json(results);
  });
};

// Crear un nuevo turno
const crearTurno = (req, res) => {
  const { nombre, fecha } = req.body;

  if (!nombre || !fecha) {
    return res.status(400).json({ message: 'Faltan campos' });
  }

  const query = 'INSERT INTO turno (nombre, fecha) VALUES (?, ?)';
  connection.query(query, [nombre, fecha], (err, result) => {
    if (err) {
      console.error('Error al crear turno', err);
      return res.status(500).json({ message: 'Error al crear turno' });
    }
    res.status(201).json({ message: 'Turno creado', id: result.insertId });
  });
};

// Eliminar un turno por ID
const eliminarTurno = (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM turno WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar turno', err);
      return res.status(500).json({ message: 'Error al eliminar turno' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json({ message: 'Turno eliminado correctamente' });
  });
};

module.exports = {
  obtenerTurnos,
  crearTurno,
  eliminarTurno
};
