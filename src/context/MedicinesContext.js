import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthContext';

const MedicinesContext = createContext({});

export const MedicinesProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMedicines();
    }
  }, [user]);

  const fetchMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) return { data: null, error };

      setMedicines(data);
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e };
    }
  };

  const addMedicine = async (medicine) => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .insert([{ ...medicine, user_id: user.id, taken: false }])
        .select();

      if (error) return { data: null, error };

      setMedicines(prev => [data[0], ...prev]);
      return { data: data[0], error: null };
    } catch (e) {
      return { data: null, error: e };
    }
  };

  const updateMedicine = async (id, updatedFields) => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .update(updatedFields)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) return { data: null, error };

      setMedicines(prev =>
        prev.map(m => (m.id === id ? { ...m, ...updatedFields } : m))
      );

      return { data: data[0], error: null };
    } catch (e) {
      return { data: null, error: e };
    }
  };

  const deleteMedicine = async (id) => {
    try {
      const { error } = await supabase
        .from('medicines')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) return { error };

      setMedicines(prev => prev.filter(m => m.id !== id));
      return { error: null };
    } catch (e) {
      return { error: e };
    }
  };

  return (
    <MedicinesContext.Provider
      value={{
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        fetchMedicines
      }}
    >
      {children}
    </MedicinesContext.Provider>
  );
};

export const useMedicines = () => useContext(MedicinesContext);
