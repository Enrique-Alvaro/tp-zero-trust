import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/');
    } else {
      setRole(JSON.parse(userData).role);
    }
  }, [navigate]);

  return (
    <div>
      <h2>Bienvenido al Dashboard</h2>
      {role === 'admin' && <p>Estás viendo contenido para administradores.</p>}
      {role === 'paciente' && <p>Estás viendo contenido para pacientes.</p>}
      {role === 'medico' && <p>Estás viendo contenido para medicos.</p>}
      {role === 'recepcionista' && <p>Estás viendo contenido para recepcionistas.</p>}
      {role === 'admin' && (<button onClick={() => navigate('/admin')}> Ir al panel de Admin </button>)}
    </div>
  );
}

export default Dashboard;
