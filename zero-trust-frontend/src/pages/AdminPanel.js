import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('none'); // 'none', 'logs', 'users'
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'admin') {
      alert('Acceso denegado para rol actual');
      navigate('/dashboard');
      return;
    }
  }, [navigate]);

  const handleViewLogs = async () => {
  setUsers([]);  // Limpiar los usuarios
  setView('logs');  // Cambiar a la vista de logs
  const token = localStorage.getItem('token');

  try {
    const res = await axios.get('http://localhost:3001/api/admin/logs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Datos de logs:", res.data); // Verifica los datos que recibes
    setLogs(res.data || []);  // Actualizar el estado con los logs
  } catch (err) {
    console.error('Error al cargar logs:', err);
    setLogs([]);  // Asegurarse de limpiar los logs en caso de error
  }
};


  const handleViewUsers = async () => {
  setLogs([]);  // Limpiar los logs
  setView('users');  // Cambiar a la vista de usuarios
  const token = localStorage.getItem('token');

  try {
    const res = await axios.get('http://localhost:3001/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Datos de usuarios:", res.data); // Verifica los datos que recibes
    setUsers(res.data || []);  // Actualizar el estado con los usuarios
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    setUsers([]);  // Asegurarse de limpiar los usuarios en caso de error
  }
};


  return (
    <div>
      <h2>Panel de Admin</h2>
      <p>Acá iria contenido de acuerdo al panel</p>

      <button onClick={handleViewLogs} style={buttonStyle}>Ver Logs</button>
      <button onClick={handleViewUsers} style={buttonStyle}>Ver Usuarios</button>
      <button onClick={() => navigate('/dashboard')} style={buttonStyle}>Volver al Dashboard</button>

      {view === 'logs' && (
  <div>
    <h3>Logs</h3>
    {logs.length === 0 ? (
      <p>No hay logs disponibles.</p>
    ) : (
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <strong>{log.accion}</strong> - {log.descripcion} ({log.fecha})
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
      {view === 'users' && (
  <div>
    <h3>Usuarios</h3>
    {users.length === 0 ? (
      <p>No hay usuarios registrados.</p>
    ) : (
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.id} - {user.username} ({user.email}) - Rol: {user.role}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px 20px',
  margin: '5px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default AdminPanel;

