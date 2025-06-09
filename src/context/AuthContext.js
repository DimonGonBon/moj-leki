import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AuthContext = createContext({}); //Создание контекста без значения

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false); //Вошел ли юзер
  const [user, setUser] = useState(null); //Данные юзера
  const [loading, setLoading] = useState(true); //Есть ли загрузка статуса сессии?

  // пытаемся войти в систему с данными что ввел юзер
const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { error };

//Если юзер вошел успешно то сохраняем его данные и делаем статус его isLoggedIn на тру
    if (data?.session?.user) {
      setUser(data.session.user);
      setLoggedIn(true);
    }

    return { error: null, user: data.session.user };
  } catch (e) {
    return { error: e };
  }
};

//Тут создаем пользователя через СупаБазе и если успешно то возвращаем юзер
const register = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return { error };

    return { error: null, user: data.user };
  } catch (e) {
    return { error: e };
  }
};


//Просто выходим из системы и сбрасывем состояния локальные.
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


//При запуске проги получаем от супабазе сессию что была сохранена и если юзер был залогинен то восстанавливаем его
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

    //Как бы слушаем события входа и выхода и если сигнед ин то устанавливаем пользователя и статус входа, а если аут то очищаем данные
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

  //Тут передача идет в контексте статус входа, пользователь, флаг загрузки, функции входа и выхода, регистрации
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
//Упростили доступ к контексту через хук
export const useAuth = () => useContext(AuthContext);
