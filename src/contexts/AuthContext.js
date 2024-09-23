import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const value = {
    user,
    login: (userData) => setUser(userData),
    logout: () => setUser(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Composant wrapper amélioré
export const AuthConsumer = ({ children }) => {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();

  const wrappedLogin = (userData) => {
    login(userData);
    navigate(`/${userData.type}`);
  };

  const wrappedLogout = () => {
    logout();
    navigate('/login');
  };

  const isLoggedIn = !!user;

  return children({ 
    login: wrappedLogin, 
    logout: wrappedLogout, 
    user,
    isLoggedIn,
    userType: user ? user.type : null
  });
};