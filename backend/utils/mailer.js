const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Usa el servicio de correo que prefieras
  auth: {
    user: 'testmfa25@gmail.com', // Cambia esto por tu correo
    pass: 'ruyu bziw xard atil ', // Usa una contraseña de aplicación
  },
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: 'testmfa25@gmail.com',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;