import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { error };

    if (data?.session?.user) {
      setUser(data.session.user);
      setLoggedIn(true);
    }

    return { error: null, user: data.session.user };
  } catch (e) {
    return { error: e };
  }
};


const register = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return { error };

    return { error: null, user: data.user };
  } catch (e) {
    return { error: e };
  }
};



const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error };

    setLoggedIn(false);
    setUser(null);
    return { error: null };
  } catch (e) {
    return { error: e };
  }
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
