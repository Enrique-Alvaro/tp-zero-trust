import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'admin') {
      alert('Acceso denegado para rol actual');
      navigate('/dashboard');
      return;
    }

    axios.get('http://localhost:3001/api/admin/data', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setMessage(res.data.message))
    .catch(err => {
      console.error(err);
      setMessage('Acceso denegado o error del servidor.');
    });
  }, [navigate]);

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    setUsers([]); // Borrar usuarios antes de mostrar logs
    try {
      const res = await axios.get('http://localhost:3001/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      alert('Error al cargar logs');
    }
  };
  
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    setLogs([]); // Borrar logs antes de mostrar usuarios
    try {
      const res = await axios.get('http://localhost:3001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert('Error al cargar usuarios');
    }
  };
  

  return (
    <div>
      <h2>Panel de Admin</h2>
      <p>{message}</p>

      <button onClick={() => navigate('/dashboard')} style={btnStyle}>Volver al Dashboard</button>
      <button onClick={fetchLogs} style={btnStyle}>Ver Logs</button>
      <button onClick={fetchUsers} style={btnStyle}>Ver Usuarios</button>
      <button onClick={() => alert('Asignar roles (no implementado aún)')} style={btnStyle}>Asignar Roles</button>
      <button onClick={() => alert('Crear usuario (no implementado aún)')} style={btnStyle}>Crear Usuario</button>

      <div>
        {logs.length > 0 && (
          <div>
            <h3>Logs</h3>
            <ul>
              {logs.map((log, idx) => (
                <li key={idx}>
                  [{log.createdAt}] {log.accion} - {log.descripcion} (Usuario: {log.username || 'N/A'})
                </li>
              ))}
            </ul>
          </div>
        )}

        {users.length > 0 && (
          <div>
            <h3>Usuarios</h3>
            <ul>
              {users.map((user, idx) => (
                <li key={idx}>
                  ID: {user.id} | Usuario: {user.username} | Rol: {user.role}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const btnStyle = {
  margin: '8px',
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default AdminPanel;