const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3001;
const logAuditoria = require('./utils/logAuditoria');

app.use(cors());
app.use(express.json());

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
  return async(req, res, next) => {
    const user = req.user;
    if (!user || user.role !== requiredRole) {
      await logAuditoria(
        userId,
        'Acceso denegado',
        `Intento de acceso a ruta protegida con rol requerido "${requiredRole}". Rol actual: "${user?.role || 'ninguno'}".`,
        username
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

// Usuario hardcodeado
const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('1234567', 10),
    role: 'admin'
  },
  {
    id: 2,
    username: 'paciente',
    password: bcrypt.hashSync('1234567', 10),
    role: 'paciente'
  },
  {
    id: 3,
    username: 'recepcionista',
    password: bcrypt.hashSync('1234567', 10),
    role: 'recepcionista'
  },
  {
    id: 4,
    username: 'medico',
    password: bcrypt.hashSync('1234567', 10),
    role: 'medico'
  }
];

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    await logAuditoria(user?.id ?? null, 'Login fallido', `Credenciales inválidas para usuario: ${username}`, username);
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  await logAuditoria(user.id, 'Login exitoso', `El usuario ${username} inició sesión`, username);

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secreto', {
    expiresIn: '1h'
  });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
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

//Creacion de usuarios Hardcodeados
/*
username: admin
pass: 1234567

username: medico
pass: 1234567

username: recepcionista
pass: 1234567

username: paciente
pass: 1234567
*/

const sequelize = require('./config/db');
const User = require('./models/User');
const Auditoria = require('./models/Auditoria');

const init = async () => {
  await sequelize.sync({ force: true }); // Resetea la base

  const hashed = await bcrypt.hash('1234567', 10);

  await User.bulkCreate([
    { username: 'admin', password: hashed, role: 'admin' },
    { username: 'doctor', password: hashed, role: 'medico' },
    { username: 'recepcion', password: hashed, role: 'recepcion' }
  ]);

  console.log('Usuarios creados.');
};

init();

