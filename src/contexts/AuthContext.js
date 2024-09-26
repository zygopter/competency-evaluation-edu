import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe dans le localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser.user);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const checkAuthToken = async (token) => {
    // TODO: Implémenter la vérification du token avec le backend
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        const decodedUser = jwtDecode(response.token);
        setUser(decodedUser.user);
        return decodedUser.user;
      } else {
        throw new Error('Token non reçu');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        const decodedUser = jwtDecode(response.token);
        setUser(decodedUser.user);
        return decodedUser.user;
      } else {
        throw new Error('Token non reçu après inscription');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Composant wrapper amélioré
export const AuthConsumer = ({ children }) => {
  const { user, login, logout, register } = useAuth();
  const isLoggedIn = !!user;

  return children({
    isLoggedIn,
    user,
    login,
    logout,
    register
  });
};