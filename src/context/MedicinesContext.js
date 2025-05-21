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
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Błąd ładowania leków:', error);
    } else {
      setMedicines(data);
    }
  };

  const addMedicine = async (medicine) => {
    const { data, error } = await supabase.from('medicines').insert([
      { ...medicine, user_id: user.id, taken: false }
    ]).select();

    if (error) {
      console.log('Błąd dodania leków:', error);
    } else {
      setMedicines(prev => [data[0], ...prev]);
    }
  };

  const updateMedicine = async (id, updatedFields) => {
    const { data, error } = await supabase
      .from('medicines')
      .update(updatedFields)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) {
      console.log('Błąd odświeżania:', error);
    } else {
      setMedicines(prev =>
        prev.map(m => (m.id === id ? { ...m, ...updatedFields } : m))
      );
    }
  };

  const deleteMedicine = async (id) => {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.log('Błąd usuwania leków:', error);
    } else {
      setMedicines(prev => prev.filter(m => m.id !== id));
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
