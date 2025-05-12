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
  const [medico, setSelectedMedico] = useState('');
  const [medicos, setMedicos] = useState([]);
  const [paciente, setSelectedPaciente] = useState('');
  const [pacientes, setPaciente] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || (user.role !== 'recepcionista' && user.role !== 'admin')) {
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

    axios.get('http://localhost:3001/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        const aux = res.data;
        const pacientesFiltrados = res.data.filter(user => user.role === 'paciente'); // Filtrar solo pacientes
        const medicosFiltrados = aux.filter(user => user.role === 'medico'); // Filtrar solo médicos
        setPaciente(pacientesFiltrados);
        setMedicos(medicosFiltrados);
      })
      .catch(err => {
        console.error('Error al cargar médicos o pacientes', err);
      });
  }, [navigate]);

  const handleAddTurno = () => {
    if (!nombre || !fecha || !edad || !altura || !peso || !motivo || !medico || !paciente) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const token = localStorage.getItem('token');

    axios.post('http://localhost:3001/api/turnos', { nombre, fecha, edad, altura, peso, motivo, medico, paciente }, {
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
        setSelectedMedico('');
        setSelectedPaciente('');
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
      <h2 style={{ textAlign: 'center', color: 'black' }}>Panel de Recepcionista</h2>

      <div style={{ marginBottom: '30px', padding: '35px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ color: '#333' }}>Agregar Turno</h3>
        <select
          value={paciente}
          onChange={(e) => {
            setSelectedPaciente(e.target.value);
            const selectedPaciente = pacientes.find((p) => p.id.toString() === e.target.value);
            if (selectedPaciente) {
              setNombre(selectedPaciente.first_name + ' ' + selectedPaciente.last_name);
            }
          }}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          <option value="">Seleccione un Paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente.id} value={paciente.id}>
              {paciente.first_name + ' ' + paciente.last_name} {/* Mostrar el nombre del médico */}
            </option>
          ))}
        </select>
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
        <select
          value={medico}
          onChange={(e) => setSelectedMedico(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          <option value="">Seleccione un médico</option>
          {medicos.map((medico) => (
            <option key={medico.id} value={medico.id}>
              {medico.first_name + ' ' + medico.last_name}  {/* Mostrar el nombre del médico */}
            </option>
          ))}
        </select>
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
                  cursor: 'pointer',
                  width: '80px',
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
