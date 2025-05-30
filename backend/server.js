const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendMail = require('./utils/mailer');
const app = express();
const PORT = 3001;
const logAuditoria = require('./utils/logAuditoria');
const connection = require('./config/db');//nueva base RDS

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);


connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos MySQL');
});


// Middleware para verificar token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  jwt.verify(token, 'secreto', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Middleware para verificar rol
function authorizeRole(requiredRole) {
  return async (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== requiredRole) {
      await logAuditoria(
        user?.id ?? null,
        'Acceso denegado',
        `Intento de acceso a ruta protegida con rol requerido "${requiredRole}". Rol actual: "${user?.role || 'ninguno'}".`,
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
}


// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
  
      const user = results[0];
  
      if (!user || !bcrypt.compareSync(password, user.password)) {
        await logAuditoria(user?.id ?? null, 'Login fallido', `Credenciales inválidas para usuario: ${username}`, username);
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      await logAuditoria(user.id, 'Login exitoso', `El usuario ${username} inició sesión`, username);
  
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role, email: user.email }, 'secreto', {
        expiresIn: '1h'
      });
  
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email
        }
      });
    }
  );
  

  if (!user || !bcrypt.compareSync(password, user.password)) {
    await logAuditoria(user?.id ?? null, 'Login fallido', `Credenciales inválidas para usuario: ${username}`, username);
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  await logAuditoria(user.id, 'Login exitoso', `El usuario ${username} inició sesión`, username);

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role, email: user.email }, 'secreto', {
    expiresIn: '1h'
  });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      mail: user.mail
    }
  });
});

// Ruta para admins
app.get('/api/admin/data', verifyToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Accediste a datos de administrador.' });
});

// Ruta para pacientes
app.get('/api/patient/data', verifyToken, authorizeRole('paciente'), (req, res) => {
  res.json({ message: 'Accediste a datos de paciente.' });
});

// Ruta para medicos
app.get('/api/medic/data', verifyToken, authorizeRole('medico'), (req, res) => {
  res.json({ message: 'Accediste a datos de medico.' });
});

// Ruta para recepcionistas
app.get('/api/recepcionist/data', verifyToken, authorizeRole('recepcionista'), (req, res) => {
  res.json({ message: 'Accediste a datos de recepcionista.' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const turnoRoutes = require('./routes/turnoRoutes');
app.use('/api/turnos', turnoRoutes);

const otps = {}; // Almacén temporal para los OTPs (usa una base de datos en producción)

// Ruta para enviar el OTP
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;

  // Generar un código OTP de 6 dígitos
  const otp = crypto.randomInt(100000, 999999).toString();

  // Guardar el OTP en memoria (asociado al correo)
  otps[email] = otp;

  try {
    // Enviar el OTP al correo del usuario
    await sendMail(email, 'Tu código OTP', `Tu código de verificación es: ${otp}`);
    res.json({ message: 'OTP enviado al correo electrónico' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
});

// Ruta para verificar el OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Verificar si el OTP es correcto
  if (otps[email] === otp) {
    delete otps[email]; // Eliminar el OTP después de usarlo
    res.json({ message: 'OTP verificado correctamente' });
  } else {
    res.status(400).json({ message: 'OTP inválido o expirado' });
  }
});
