import { useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const saveToken = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return { token, setToken: saveToken, logout };
};
