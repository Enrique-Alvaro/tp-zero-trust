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
    setUsers([]);
    setView('logs');
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get('http://localhost:3001/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data || []);
    } catch (err) {
      console.error('Error al cargar logs:', err);
      setLogs([]);
    }
  };

  const handleViewUsers = async () => {
    setLogs([]);
    setView('users');
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get('http://localhost:3001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setUsers([]);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Panel de Administración</h2>
      <p style={descriptionStyle}>Selecciona una opción para ver los datos correspondientes.</p>

      <div style={buttonContainerStyle}>
        <button onClick={handleViewLogs} style={buttonStyle}>Ver Logs</button>
        <button onClick={handleViewUsers} style={buttonStyle}>Ver Usuarios</button>
        <button onClick={() => navigate('/dashboard')} style={buttonStyle}>Volver al Dashboard</button>
      </div>

      {view === 'logs' && (
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>Logs</h3>
          {logs.length === 0 ? (
            <p style={emptyMessageStyle}>No hay logs disponibles.</p>
          ) : (
            <div style={listContainerStyle}>
              <ul style={listStyle}>
                {logs.map((log, index) => (
                  <li key={index} style={listItemStyle}>
                    <strong>{log.accion}</strong> - {log.descripcion} ({log.fecha})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {view === 'users' && (
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>Usuarios</h3>
          {users.length === 0 ? (
            <p style={emptyMessageStyle}>No hay usuarios registrados.</p>
          ) : (
            <div style={listContainerStyle}>
              <ul style={listStyle}>
                {users.map((user, index) => (
                  <li key={index} style={listItemStyle}>
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

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  textAlign: 'center',
  color: '#333',
};

const descriptionStyle = {
  textAlign: 'center',
  color: '#666',
  marginBottom: '20px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '20px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};

buttonStyle[':hover'] = {
  backgroundColor: '#0056b3',
};

const sectionStyle = {
  marginTop: '20px',
};

const sectionHeaderStyle = {
  color: '#333',
  borderBottom: '2px solid #007bff',
  paddingBottom: '5px',
};

const emptyMessageStyle = {
  color: '#666',
  textAlign: 'center',
};

const listContainerStyle = {
  maxHeight: '300px',
  overflowY: 'auto',
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
};

const listItemStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee',
};

export default AdminPanel;


