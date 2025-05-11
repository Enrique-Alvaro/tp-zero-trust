import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PacientePanel = () => {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [view, setView] = useState('none');
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'paciente') {
      alert('Acceso denegado');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleViewMedicos = async () => {
    setView('medicos');
    setMensaje('');
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get('http://localhost:3001/api/turnos/medicos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicos(res.data || []);
    } catch (err) {
      console.error('Error al cargar médicos:', err);
      setMedicos([]);
    }
  };

  const handleSolicitarTurno = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!nombre || !fecha) {
      setMensaje('Completa todos los campos');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/turnos/solicitar',
        { nombre, fecha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje(res.data.message);
      setNombre('');
      setFecha('');
    } catch (err) {
      console.error('Error al solicitar turno:', err);
      setMensaje('Hubo un error al solicitar el turno');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Panel del Paciente</h2>
      <p style={{ fontSize: '16px', color: '#555' }}>Acá iría contenido específico para pacientes</p>

      <button onClick={handleViewMedicos} style={buttonStyle}>Ver Médicos</button>
      <button onClick={() => setView('solicitar')} style={buttonStyle}>Solicitar Turno</button>
      <button onClick={() => navigate('/dashboard')} style={buttonStyle}>Volver al Dashboard</button>

      {view === 'medicos' && (
        <div>
          <h3>Médicos disponibles</h3>
          {medicos.length === 0 ? (
            <p>No hay médicos registrados.</p>
          ) : (
            <div style={scrollBox}>
              <ul>
                {medicos.map((medico, index) => (
                  <li key={index}>
                    {medico.username} ({medico.email})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {view === 'solicitar' && (
        <div>
          <h3>Solicitar Turno</h3>
          <form onSubmit={handleSolicitarTurno}>
            <input
              type="text"
              placeholder="Nombre del médico"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyle}
            />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Confirmar Turno</button>
          </form>
          {mensaje && <p>{mensaje}</p>}
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px 20px',
  margin: '5px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const inputStyle = {
  margin: '5px',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const scrollBox = {
  maxHeight: '300px',
  overflowY: 'auto',
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '8px'
};

export default PacientePanel;
