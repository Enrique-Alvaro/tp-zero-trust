import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import logo from '../assets/logo.png';

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
    <div className="dashboard-container">
      <div className="dashboard-card">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <h2 className="dashboard-title">Bienvenido al Dashboard</h2>

        {role === 'admin' && (
          <>
            <p>Estás viendo contenido para administradores.</p>
            <button className="dashboard-button" onClick={() => navigate('/admin')}>Ir al panel de Admin</button>
          </>
        )}

        {role === 'paciente' && (
          <>
            <p>Estás viendo contenido para pacientes.</p>
            <button className="dashboard-button" onClick={() => navigate('/paciente')}>Ir al panel de Pacientes</button>
          </>
        )}

        {role === 'medico' && (
          <>
            <p>Estás viendo contenido para médicos.</p>
            <button className="dashboard-button" onClick={() => navigate('/medico')}>Ir al panel de Médico</button>
          </>
        )}

        {role === 'recepcionista' && (
          <>
            <p>Estás viendo contenido para el área de recepción.</p>
            <button className="dashboard-button" onClick={() => navigate('/recepcionista')}>Ir al panel de Recepción</button>
          </>
        )}

        <button className="dashboard-button logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;


