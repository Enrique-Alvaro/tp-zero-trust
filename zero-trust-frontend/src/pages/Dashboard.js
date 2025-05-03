import React from 'react';
import { useAuth } from '../utils/auth';

const Dashboard = () => {
  const { token } = useAuth();

  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Bienvenido, {userRole === 'admin' ? 'Admin' : 'User'}!</p>
      {userRole === 'admin' ? (
        <div>Contenido exclusivo para admins.</div>
      ) : (
        <div>Contenido limitado para usuarios.</div>
      )}
    </div>
  );
};

export default Dashboard;
