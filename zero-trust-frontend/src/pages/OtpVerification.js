import React, { useState } from 'react';
import axios from 'axios';

const OtpVerification = ({ email, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-otp', { email, otp });
      alert(response.data.message); // Mensaje de éxito
      onVerified(); // Llama a la función para continuar después de la verificación
    } catch (err) {
      setError(err.response?.data?.message || 'Error al verificar el OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Verificación OTP</h2>
      <p>Se ha enviado un código de verificación al correo: {email}</p>
      <input
        type="text"
        placeholder="Ingresa el código OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOtp} disabled={loading}>
        {loading ? 'Verificando...' : 'Verificar OTP'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default OtpVerification;