import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PacientePanel = () => {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || (user.role !== 'paciente' && user.role !== 'admin')) {
      alert('Acceso denegado');
      navigate('/dashboard');
      return;
    }

    // Obtener médicos disponibles
    axios.get('http://localhost:3001/api/turnos/medicos', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setMedicos(res.data || []);
    })
    .catch(err => {
      console.error('Error al cargar médicos:', err);
      setMedicos([]);
    });

    // Obtener turnos asociados al paciente
    axios.get('http://localhost:3001/api/turnos', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const turnosFiltrados = res.data.filter(turno => turno.paciente === user.id); // Filtrar turnos por paciente logueado
      setTurnos(turnosFiltrados);
    })
    .catch(err => {
      console.error('Error al cargar turnos:', err);
      setTurnos([]);
    });
  }, [navigate]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Panel del Paciente</h2>

      {/* Médicos disponibles */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Médicos Disponibles</h3>
        {medicos.length === 0 ? (
          <p>No hay médicos registrados.</p>
        ) : (
          <div style={gridStyle}>
            {medicos.map((medico) => (
              <div key={medico.id} style={cardStyle}>
                <h4 style={{ color: '#333' }}>{medico.first_name + ' ' + medico.last_name }</h4>
                <p style={{ color: '#555' }}>Email: {medico.email}</p>
                <p style={{ color: '#555' }}>Especialidad: {medico.especialidad || 'No especificada'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Turnos asociados */}
      <div>
        <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Tus Turnos</h3>
        {turnos.length === 0 ? (
          <p>No tienes turnos asignados.</p>
        ) : (
          <div style={gridStyle}>
            {turnos.map((turno) => (
              <div key={turno.id} style={cardStyle}>
                <h4 style={{ color: '#333' }}>Turno con {turno.medico_nombre}</h4>
                <p style={{ color: '#555' }}>Fecha: {new Date(turno.fecha).toLocaleDateString('es-ES')}</p>
                <p style={{ color: '#555' }}>Hora: {new Date(turno.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                <p style={{ color: '#555' }}>Motivo: {turno.motivo || 'No especificado'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para volver al Dashboard */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Volver al Dashboard
      </button>
    </div>
  );
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'left',
};

export default PacientePanel;