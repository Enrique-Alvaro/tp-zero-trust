import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MedicoPanelDetails = () => {
  const location = useLocation(); // Obtener los datos pasados desde la navegación
  const navigate = useNavigate();
  const { paciente } = location.state || {}; // Extraer los datos del paciente

  if (!paciente) {
    return <p>No se encontraron datos del paciente.</p>;
  }

  return (
    <div style={{ display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',}}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'left',
      }}>
        <h2 style={{
          color: '#333',
          marginBottom: '20px',
          fontSize: '24px',
          borderBottom: '2px solid #007bff',
          paddingBottom: '10px',
        }}>
          Detalles del Paciente
        </h2>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          <strong>Nombre:</strong> {paciente.nombre}
        </p>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          <strong>Edad:</strong> {paciente.edad} años
        </p>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          <strong>Altura:</strong> {paciente.altura} cm
        </p>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          <strong>Peso:</strong> {paciente.peso} kg
        </p>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          <strong>Motivo de la consulta:</strong> {paciente.motivo_consulta}
        </p>
        <button onClick={() => navigate('/medico')}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Volver al Panel
        </button>
      </div>
    </div>
  );
};

export default MedicoPanelDetails;