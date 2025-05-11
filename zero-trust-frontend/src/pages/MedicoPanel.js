import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedicoPanel = () => {
    const turnosData = [
    { nombre_paciente: "elias", fecha: '2023-10-01', hora: '10:00 AM' },
    { nombre_paciente: "maria", fecha: '2023-10-02', hora: '11:00 AM' },
    { nombre_paciente: "jose", fecha: '2023-10-03', hora: '12:00 PM' },
    { nombre_paciente: "carla", fecha: '2023-10-10', hora: '07:00 PM' },
    { nombre_paciente: "ana", fecha: '2023-10-04', hora: '01:00 PM' },
    { nombre_paciente: "luis", fecha: '2023-10-05', hora: '02:00 PM' },
    { nombre_paciente: "sofia", fecha: '2023-10-06', hora: '03:00 PM' },
    { nombre_paciente: "pablo", fecha: '2023-10-07', hora: '04:00 PM' },
    { nombre_paciente: "lucia", fecha: '2023-10-08', hora: '05:00 PM' },
    { nombre_paciente: "martin", fecha: '2023-10-09', hora: '06:00 PM' },
     ];

  const [message, setMessage] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTurnoId, setSelectedTurnoId] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'medico') {
      alert('Acceso denegado para rol actual');
      navigate('/dashboard');
      return;
    }


  //   axios.get('http://localhost:3001/api/medic/data', {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   .then(res => {
  //         setMessage(res.data.message);
  //         setTurnos(turnosData);
  //       })   
  //   .catch(err => {
  //     console.error(err);
  //     setMessage('Acceso denegado o error del servidor.');
  //   });
  // }, [navigate]);

     axios.get('http://localhost:3001/api/turnos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      console.log(res.data.turnos);
      setMessage('Turnos cargados correctamente.');
      setTurnos(res.data || []); // Asignar los turnos obtenidos de la API
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
    <div>
      <h2 style={{
      color: 'black',
      fontSize: '32px',
      textAlign: 'left',
      marginBottom: '20px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      borderBottom: '2px solid black',
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
                }} title="Ver"
                onClick={() => handleDetails(turno)}>
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
                <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                title="Eliminar"
                onClick={() => openModal(turno.id)}
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                    clipRule="evenodd"
                  />
                </svg>
                </button>


            </div>
            
          ))
        ) : (
          <p>No hay turnos próximos.</p>
        )}
      </div>
      <button onClick={() => navigate('/dashboard')}
      style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
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
