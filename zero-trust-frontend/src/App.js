import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import PacientePanel from './pages/PacientePanel';
import MedicoPanel from './pages/MedicoPanel';
import RecepcionistaPanel from './pages/RecepcionistaPanel';
import MedicoPanelDetails from './pages/MedicoPanel_Details';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    console.log('Usuario logueado:', userData);
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/paciente" element={<PacientePanel />} />
        <Route path="/medico" element={<MedicoPanel />} />
         <Route path="/medico-panel/details" element={<MedicoPanelDetails />} />
        <Route path="/recepcionista" element={<RecepcionistaPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
