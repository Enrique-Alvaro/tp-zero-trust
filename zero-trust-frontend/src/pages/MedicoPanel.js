import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedicoPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'medico') {
      alert('Acceso denegado para rol actual');
      navigate('/dashboard');
      return;
    }

  }, [navigate]);

  return (
    <div>
      <h2>Panel de Medico</h2>
      <p>Acá iria contenido de acuerdo al panel</p>
      <button onClick={() => navigate('/dashboard')}
      style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}> Volver al Dashboard </button>
    </div>
  );
};

export default MedicoPanel;
