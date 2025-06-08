import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MedicinesContext = createContext({});
const STORAGE_KEY = 'cached_medicines';

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

      if (error || !data) {
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setMedicines(parsed);
          console.log('📦 Loaded medicines from offline cache');
          return { data: parsed, error: null };
        }
        return { data: null, error };
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setMedicines(data);
      return { data, error: null };
    } catch (e) {
      console.error('❌ fetchMedicines error:', e);
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setMedicines(parsed);
        return { data: parsed, error: null };
      }
      return { data: null, error: e };
    }
  };

  const updateCache = async (updatedList) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  };

  const addMedicine = async (medicine) => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .insert([{ ...medicine, user_id: user.id, taken: false }])
        .select();

      if (error) return { data: null, error };

      const newList = [data[0], ...medicines];
      setMedicines(newList);
      await updateCache(newList);

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

      const newList = medicines.map(m =>
        m.id === id ? { ...m, ...updatedFields } : m
      );
      setMedicines(newList);
      await updateCache(newList);

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

      const newList = medicines.filter(m => m.id !== id);
      setMedicines(newList);
      await updateCache(newList);

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
