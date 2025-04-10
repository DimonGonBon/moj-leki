// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // По умолчанию пользователь НЕ авторизован (false)
  const [isLoggedIn, setLoggedIn] = useState(false);

  const login = () => {
    console.log('login called');
    setLoggedIn(true);
  };

  const logout = () => {
    console.log('logout called');
    setLoggedIn(false);
  };

  // Отладочный эффект, который выводит текущее состояние авторизации
  useEffect(() => {
    console.log('Auth state changed, isLoggedIn:', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);