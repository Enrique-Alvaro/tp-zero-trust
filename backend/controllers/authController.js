const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../config/db');
const logAuditoria = require('../utils/logAuditoria');

const login = async (req, res) => {
    const { username, password } = req.body;
  
    connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, results) => {
        if (err) {
          console.error('Error al buscar usuario:', err);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
  
        const user = results[0];
  
        if (!user) {
          await logAuditoria(null, 'Login fallido', `Intento de login con usuario inexistente: ${username}`, username);
          return res.status(400).json({ message: 'Usuario no encontrado' });
        }
  
        const valid = await bcrypt.compare(password, user.password);
  
        if (!valid) {
          await logAuditoria(user.id, 'Login fallido', `Contraseña incorrecta para usuario: ${username}`, username);
          return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
  
        await logAuditoria(user.id, 'Login exitoso', `El usuario ${username} inició sesión`, username);
  
        const token = jwt.sign({ id: user.id, role: user.role }, 'secretKey', { expiresIn: '1h' });
  
        //Respuesta del back para el front:
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      }
    );
  };

const register = async (req, res) => {
  const { first_name, last_name, username, email, password, role } = req.body;

  if (!first_name || !last_name || !username || !email || !password || !role ) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Verificar si ya existe el email
  connection.query(
    'SELECT * FROM users WHERE email = ? OR username = ?',
    [email, username],
    (err, results) => {
      if (err) {
        console.error('Error al verificar usuario existente:', err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'El email o el username ya están registrados' });
      }

      // Insertar nuevo usuario
      const query = `
        INSERT INTO users (first_name, last_name, username, email, password, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        query,
        [first_name, last_name, username, email, hashedPassword,role],
        async (err, result) => {
          if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ message: 'Error al registrar el usuario' });
          }

          await logAuditoria(result.insertId, 'Registro', `Usuario ${username} creado`, username);
          res.status(201).json({ message: 'Usuario creado con éxito', userId: result.insertId });
        }
      );
    }
  );
};

module.exports = { login, register };
