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
  };

  useEffect(() => {
    const verify = async () => {
      if (!user) {
        setIsVerifying(false);
        return;
      }
      try {
        await axios.get(`/auth/validate?username=${user.username}`);
      } catch (err) {
        logout();
      } finally {
        setIsVerifying(false);
      }
    };
    verify();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isVerifying }}>
      {(!isVerifying || user) ? children : (
        <div className="h-screen w-screen bg-navy-dark flex items-center justify-center">
            <div className="animate-pulse text-lemon font-black uppercase tracking-[0.5em]">Authenticating...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);