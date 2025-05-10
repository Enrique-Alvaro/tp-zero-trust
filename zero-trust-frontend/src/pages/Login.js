import React, { useState } from 'react';
import axios from 'axios';
import OtpVerification from './OtpVerification';
import './Login.css';
import logo from '../assets/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Login, 2: OTP Verification
  const [error, setError] = useState('');
  const [loginResponse, setLoginResponse] = useState(null);

  const handleLogin = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { username, password });
      console.log(response.data);
      setLoginResponse(response.data); // Guarda la respuesta del login
      const { user } = response.data;
      setEmail(user.email); // Guarda el correo del usuario
      await axios.post('http://localhost:3001/api/auth/send-otp', { email: user.email }); // Enviar OTP
      setStep(2); // Cambiar al paso de verificación OTP
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

const handleOtpVerified = () => {
  try {
    const { token, user } = loginResponse; // Usa la respuesta almacenada
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = '/dashboard'; // Redirigir al dashboard
  } catch (err) {
    console.error('Error al guardar el token o redirigir:', err);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Clínica San Cristóbal" className="login-logo" />
        {step === 1 && (
          <>
            <h2>Bienvenido a Clínica San Cristóbal</h2>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Iniciar Sesión</button>
            {error && <p className="error">{error}</p>}
          </>
        )}
        {step === 2 && <OtpVerification email={email} onVerified={handleOtpVerified} />}
      </div>
    </div>
  );
};

export default Login;