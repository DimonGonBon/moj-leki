import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext'; 
import { useMedicines } from '../context/MedicinesContext'; 

export default function AddMedicineScreen({ navigation }) {
  const { addMedicine } = useMedicines();  
  const { user } = useAuth();              

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [dose, setDose] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');



const handleAdd = async () => {
  if (!name || !type || !dose) {
    Alert.alert("Błąd", "Wprowadź nazwę, typ i dawkę leku.");
    return;
  }

  const newMedicine = {
    name,
    type,
    dose,
    image,
    description
  };

  await addMedicine(newMedicine);

  setName('');
  setType('');
  setDose('');
  setImage('');
  setDescription('');
  navigation.goBack();
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj lek</Text>
      <TextInput style={styles.input} placeholder="Nazwa leku" value={name} onChangeText={setName} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="Typ (tabletki, syrop...)" value={type} onChangeText={setType} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="Dawka (np. 500mg)" value={dose} onChangeText={setDose} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="URL obrazka" value={image} onChangeText={setImage} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="Opis" value={description} onChangeText={setDescription} placeholderTextColor="#ccc" />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Dodaj</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1c1c1c' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#00ff99' },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderColor: '#00ff99',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#00ff99',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: { color: '#1c1c1c', fontWeight: 'bold', fontSize: 16 }
});



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