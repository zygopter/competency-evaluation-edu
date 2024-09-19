import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);

  const value = {
    userType,
    login: (type) => setUserType(type),
    logout: () => setUserType(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Nouveau composant wrapper
export const AuthConsumer = ({ children }) => {
  const { login, logout, userType } = useAuth();
  const navigate = useNavigate();

  const wrappedLogin = (type) => {
    login(type);
    navigate(`/${type}`);
  };

  const wrappedLogout = () => {
    logout();
    navigate('/login');
  };

  return children({ login: wrappedLogin, logout: wrappedLogout, userType });
};