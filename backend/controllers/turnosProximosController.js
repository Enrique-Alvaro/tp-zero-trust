const connection = require('../config/db'); // Asegúrate de que esta conexión esté configurada correctamente

// Obtener todos los turnos con los campos especificados
const getTurnosProximos = async (req, res) => {
  try {
    const [rows] = await connection.query(
      'SELECT fecha, hora, nombre, descripcion FROM turnos_proximos'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los turnos:', error);
    res.status(500).json({ message: 'Error al obtener los turnos' });
  }
};

// Eliminar un turno por ID
const deleteTurno = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await connection.query(
      'DELETE FROM turnos_proximos WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.status(200).json({ message: 'Turno eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el turno:', error);
    res.status(500).json({ message: 'Error al eliminar el turno' });
  }
};

module.exports = {
  getTurnosProximos,
  deleteTurno
};