const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const cors = require('cors');


const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // si vas a manejar cookies, JWT en headers, etc.
  }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API funcionando'));

// Inicializar base de datos y servidor
const init = async () => {
    await sequelize.sync({ force: true });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hashedPassword, role: 'admin' });

    app.listen(3001, () => console.log('Backend escuchando en http://localhost:3001'));
};

init();