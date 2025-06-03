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
      Alert.alert('Błąd', 'Nie udało się załadować leków.');
    } else {
      setMedicines(data);
    }
  };

  const addMedicine = async (medicine) => {
    const { data, error } = await supabase
      .from('medicines')
      .insert([{ ...medicine, user_id: user.id, taken: false }])
      .select();

    if (error) {
      Alert.alert('Błąd', 'Nie udało się dodać leku.');
    } else {
      setMedicines(prev => [data[0], ...prev]);
      Alert.alert('Sukces', 'Lek został dodany.');
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
      Alert.alert('Błąd', 'Nie udało się zaktualizować leku.');
    } else {
      setMedicines(prev =>
        prev.map(m => (m.id === id ? { ...m, ...updatedFields } : m))
      );
      Alert.alert('Sukces', 'Lek został zaktualizowany.');
    }
  };

  const deleteMedicine = async (id) => {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Błąd', 'Nie udało się usunąć leku.');
    } else {
      setMedicines(prev => prev.filter(m => m.id !== id));
      Alert.alert('Sukces', 'Lek został usunięty.');
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
