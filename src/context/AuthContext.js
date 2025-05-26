import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.session) {
      setUser(data.session.user);
      setLoggedIn(true);
    } else {
      console.log('Login error:', error);
    }
  };
  

  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log('Registration error:', error);
      return { error };
    }

    return { data };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setUser(null);
  };

useEffect(() => {
  const initAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setLoggedIn(true);
      setUser(data.session.user);
    }
    setLoading(false);
  };

  initAuth();

  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      setUser(session.user);
      setLoggedIn(true);
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
      setLoggedIn(false);
    }

    setLoading(false);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);




  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
