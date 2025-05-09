const connection = require('../config/db');


const logAuditoria = async (usuarioId, accion, descripcion, username) => {
  if (!usuarioId) {
    console.warn(`[AUDITORÍA] Se omitió el log porque usuarioId es NULL`);
    return;
  }
  
  
  console.log('>>> logAuditoria.js fue ejecutado');

  const query = `
    INSERT INTO auditoria (usuarioId, accion, descripcion, fecha)
    VALUES (?, ?, ?, NOW())
  `;

  connection.query(query, [usuarioId, accion, descripcion], (err, results) => {
    if (err) {
      console.error('[ERROR AUDITORÍA]', err);
      return;
    }

    console.log(`[AUDITORÍA] ${new Date().toISOString()} | Usuario: ${username || 'N/A'} | UsuarioID: ${usuarioId ?? 'N/A'} | Acción: ${accion} | Descripción: ${descripcion}`);
  });
};

module.exports = logAuditoria;