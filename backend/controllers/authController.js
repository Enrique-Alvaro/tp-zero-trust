const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const logAuditoria = require('../utils/logAuditoria');

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
        await logAuditoria(null, 'Login fallido', `Intento de login con usuario inexistente: ${username}`, username);
        return res.status(400).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        await logAuditoria(user.id, 'Login fallido', `Intento fallido de login con contraseña incorrecta: ${username}`, username);
        return res.status(401).json({ message: 'Invalid password' });
    }


    await logAuditoria(user.id, 'Login exitoso', `El usuario ${username} inició sesión`, username);

    const token = jwt.sign({ id: user.id, role: user.role }, 'secretKey');
    res.json({ token });
};

module.exports = { login };

