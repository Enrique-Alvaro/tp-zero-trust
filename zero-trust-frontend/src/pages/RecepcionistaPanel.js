import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecepcionistaPanel = () => {
  const [turnos, setTurnos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [edad, setEdad] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [motivo, setMotivo] = useState('');
  const [medico, setMedico] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'recepcionista') {
      alert('Acceso denegado para rol actual');
      navigate('/dashboard');
      return;
    }

    // Obtener turnos disponibles
    axios.get('http://localhost:3001/api/turnos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      const turnosOrdenados = res.data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setTurnos(turnosOrdenados);
    })
    .catch(err => {
      console.error(err);
      alert('Error al cargar los turnos.');
    });
  }, [navigate]);

  const handleAddTurno = () => {
    if (!nombre || !fecha || !edad || !altura || !peso || !motivo || !medico ) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const token = localStorage.getItem('token');

    axios.post('http://localhost:3001/api/turnos', { nombre, fecha,edad,altura,peso,motivo,medico }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
    return axios.get('http://localhost:3001/api/turnos', {
    headers: { Authorization: `Bearer ${token}` }
   });
})
.then(res => {
  const turnosOrdenados = res.data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  setTurnos(turnosOrdenados);
  setNombre('');
  setFecha('');
  setEdad('');
  setAltura('');
  setPeso('');
  setMotivo('');
  setMedico('');
})

    .catch(err => {
      console.error(err);
      alert('Error al agregar el turno.');
    });
  };

  const handleDeleteTurno = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3001/api/turnos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      setTurnos(turnos.filter(turno => turno.id !== id));
    })
    .catch(err => {
      console.error(err);
      alert('Error al eliminar el turno.');
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#4CAF50' }}>Panel de Recepcionista</h2>
      <p style={{ textAlign: 'center', color: '#555' }}>Acá iria contenido de acuerdo al panel</p>

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ color: '#333' }}>Agregar Turno</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <input
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
                <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <input
          type="number"
          placeholder="Altura (cm)"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <input
          type="number"
          placeholder="Peso (kg)"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <textarea
          placeholder="Motivo de la consulta"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
            resize: 'none',
            height: '80px'
          }}
        />
         <input
          type="text"
          placeholder="Medico"
          value={medico}
          onChange={(e) => setMedico(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <button
          onClick={handleAddTurno}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Agregar
        </button>
      </div>

      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ color: '#333' }}>Turnos Disponibles</h3>
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {turnos.map(turno => (
            <li
              key={turno.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #ddd'
              }}
            >
              <span>
                <strong style={{ color: '#333' }}>{turno.nombre}</strong> -{' '}
                <span style={{ color: '#555' }}>{new Date(turno.fecha).toLocaleString()}</span>
              </span>
              <button
                onClick={() => handleDeleteTurno(turno.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

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

export default RecepcionistaPanel;
