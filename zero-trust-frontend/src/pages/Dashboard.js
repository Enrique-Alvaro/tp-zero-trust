import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Bienvenido al Dashboard</h1>

      {role === 'admin' && (
        <>
          <p>Estás viendo contenido para administradores.</p>
          <button>Ir al panel de Admin</button>
        </>
      )}

      {role === 'medico' && (
        <>
          <p>Estás viendo contenido para médicos.</p>
          <button>Ir al panel del Doctor</button>
        </>
      )}

      {role === 'recepcion' && (
        <>
          <p>Estás viendo contenido para el área de recepción.</p>
          <button>Ir al panel de Recepción</button>
        </>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#d32f2f',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;

