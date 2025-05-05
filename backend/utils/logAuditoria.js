const Auditoria = require('../models/Auditoria');

const logAuditoria = async (usuarioId, accion, descripcion , username ) => {
    console.log('>>> logAuditoria.js fue ejecutado');
    try {
    const log = await Auditoria.create({ usuarioId, accion, descripcion });

    // ✅ Mostrar en consola con el nombre de usuario (si está disponible)
    console.log(`[AUDITORÍA] ${new Date().toISOString()} | Usuario: ${username || 'N/A'} | UsuarioID: ${usuarioId ?? 'N/A'} | Acción: ${accion} | Descripción: ${descripcion}`);

    return log;
  } catch (error) {
    console.error('[ERROR AUDITORÍA]', error);
  }
};

module.exports = logAuditoria;

