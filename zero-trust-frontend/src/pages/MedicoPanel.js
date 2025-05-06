import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedicoPanel = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'medico') {
      alert('Acceso denegado para rol actual');
      navigate('/dashboard');
      return;
    }

    axios.get('http://localhost:3001/api/medic/data', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setMessage(res.data.message))
    .catch(err => {
      console.error(err);
      setMessage('Acceso denegado o error del servidor.');
    });
  }, [navigate]);

  return (
    <div>
      <h2>Panel de Medico</h2>
      <p>{message}</p>
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
