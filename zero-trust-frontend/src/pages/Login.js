import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password,
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      onLogin(role);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al iniciar sesión', err);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Iniciar sesión</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block">Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
