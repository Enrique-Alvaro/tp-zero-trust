import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PacientePanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'paciente') {
      alert('Acceso denegado para rol actual');
      navigate('/dashboard');
      return;
    }
  }, [navigate]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Panel del Paciente</h2>
      <p style={{ fontSize: '16px', color: '#555' }}>Acá iria contenido de acuerdo al panel</p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Volver al Dashboard
      </button>
    </div>
  );
};

export default PacientePanel;
