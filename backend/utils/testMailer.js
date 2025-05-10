const sendMail = require('./mailer');

(async () => {
  try {
    await sendMail(
      'conde.ivanleonardo@gmail.com', // Cambia esto por un correo de prueba
      'Prueba de envío',
      'Este es un correo de prueba desde tu aplicación.'
    );
    console.log('Correo enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
})();

// se ejecuta con node utils/testMailer.js