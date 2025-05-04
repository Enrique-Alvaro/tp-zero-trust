import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'admin') {
      navigate('/');
      return;
    }

    axios.get('http://localhost:3001/api/admin/data', {
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
      <h2>Panel de Admin</h2>
      <p>{message}</p>
    </div>
  );
};

export default AdminPanel;
