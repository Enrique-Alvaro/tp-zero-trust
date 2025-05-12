import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import view from '../assets/view.png';
import deleteIcon from '../assets/delete2.png'; // Asegúrate de tener la imagen delete.png en la carpeta assets

const MedicoPanel = () => {


  const [message, setMessage] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTurnoId, setSelectedTurnoId] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || (user.role !== 'medico' && user.role !== 'admin')) {
      alert('Acceso denegado para rol actual');
      navigate('/dashboard');
      return;
    }

    axios.get('http://localhost:3001/api/turnos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      const turnosFiltrados = res.data.filter(turno => turno.medico === user.id.toString());
      setMessage('Turnos cargados correctamente.');
      setTurnos(turnosFiltrados);
    })
    .catch(err => {
      console.error(err);
      setMessage('Error al cargar los turnos o acceso denegado.');
    });
  }, [navigate]);

   const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3001/api/turnos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      setTurnos(turnos.filter(turno => turno.id !== id)); 
      setShowModal(false);
      setMessage('Turno eliminado correctamente.');
    })
    .catch(err => {
      console.error(err);
      setMessage('Error al eliminar el turno.');
    });
  };

    const handleDetails = (paciente) => {
    navigate('/medico-panel/details', { state: { paciente } }); // Pasar los datos del paciente como estado
  };

    const openModal = (id) => {
    setSelectedTurnoId(id);
    setShowModal(true); 
  };

  const closeModal = () => {
    setShowModal(false); 
    setSelectedTurnoId(null);
  };

  return (
    <div style={{
      margin: '20px',}}>
      <h2 style={{
      color: 'black',
      fontSize: '32px',
      textAlign: 'left',
      marginBottom: '20px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      borderBottom: '2px solid rgb(0, 123, 255)',
      paddingBottom: '10px',
      justifyContent: 'flex-start',
    }}>
      Panel de Médicos
    </h2>
      <p>{message}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px',marginBottom: '30px', justifyContent: 'flex-start '}}>
        {turnos.length > 0 ? (
          turnos.map((turno, index) => (
            <div key={index} style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              width: '250px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
            }}>
              <h3>Turno</h3>
              <p><strong>Paciente:</strong> {turno.nombre}</p>
              <p><strong>Fecha:</strong> {new Date(turno.fecha).toLocaleDateString('es-ES')}</p>
              <p><strong>Hora:</strong> {new Date(turno.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>

                <button style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }} title="Ver"
                onClick={() => handleDetails(turno)}>
                <img
                  src={view} // Reemplaza con la ruta correcta de tu archivo delete.png
                  alt="ver detalles"
                  style={{ width: '24px', height: '24px' }}
                />
              </button>
                <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Eliminar"
                onClick={() => openModal(turno.id)}
              >
                 <img
                  src={deleteIcon} // Reemplaza con la ruta correcta de tu archivo view.png
                  alt="Eliminar"
                  style={{ width: '24px', height: '24px' }}
                />
                </button>


            </div>
            
          ))
        ) : (
          <p>No hay turnos próximos.</p>
        )}
      </div>
      <button onClick={() => navigate('/dashboard')}
      style={{
          width: '200px',
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          marginBottom: '20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}> Volver al Dashboard </button>

 {showModal && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}>
            <p>¿Estás seguro de que deseas eliminar este turno?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => handleDelete(selectedTurnoId)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Confirmar
              </button>
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: 'gray',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MedicoPanel;
