import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
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
      Alert.alert('Błąd ładowania leków:', error);
      return { data: null, error };
    }

    setMedicines(data);
    return { data, error: null };
  };

  const addMedicine = async (medicine) => {
    const { data, error } = await supabase
      .from('medicines')
      .insert([{ ...medicine, user_id: user.id, taken: false }])
      .select();

    if (error) {
      Alert.alert('Błąd dodawania leku:', error);
      return { data: null, error };
    }

    setMedicines(prev => [data[0], ...prev]);
    return { data: data[0], error: null };
  };

  const updateMedicine = async (id, updatedFields) => {
    const { data, error } = await supabase
      .from('medicines')
      .update(updatedFields)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) {
      Alert.alert('Błąd aktualizacji leku:', error);
      return { data: null, error };
    }

    setMedicines(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updatedFields } : m))
    );

    return { data: data[0], error: null };
  };

  const deleteMedicine = async (id) => {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Błąd usuwania leku:', error);
      return { error };
    }

    setMedicines(prev => prev.filter(m => m.id !== id));
    return { error: null };
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
