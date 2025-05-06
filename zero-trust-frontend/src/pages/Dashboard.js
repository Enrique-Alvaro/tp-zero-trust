import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      alert('No tienes una sesión iniciada. Serás redirigido al login.');
      navigate('/');
    }
  }, [navigate, user]);

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
          (<button onClick={() => navigate('/admin')}> Ir al panel de Admin </button>)
        </>
      )}

      {role === 'paciente' && (
        <>
          <p>Estás viendo contenido para pacientes.</p>
          (<button onClick={() => navigate('/paciente')}> Ir al panel de Pacientes </button>)
        </>
      )}

      {role === 'medico' && (
        <>
          <p>Estás viendo contenido para médicos.</p>
          (<button onClick={() => navigate('/medico')}> Ir al panel de Medico </button>)
        </>
      )}

      {role === 'recepcionista' && (
        <>
          <p>Estás viendo contenido para el área de recepción.</p>
          (<button onClick={() => navigate('/recepcionista')}> Ir al panel de Recepcion </button>)
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

