import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isVerifying, setIsVerifying] = useState(true);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    const verifySession = async () => {
      if (!user) {
        setIsVerifying(false);
        return;
      }
      try {
        // Ping backend to see if this user still exists/session is valid
        await axios.get(`/auth/validate?username=${user.username}`);
      } catch (err) {
        // Backend said NO or Backend is DOWN
        logout();
      } finally {
        setIsVerifying(false);
      }
    };
    verifySession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isVerifying }}>
      {!isVerifying && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);