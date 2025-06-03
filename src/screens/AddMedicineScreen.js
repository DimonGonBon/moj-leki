import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useMedicines } from '../context/MedicinesContext';
import withAuthProtection from '../components/withAuthProtection';

function AddMedicineScreen({ navigation }) {
  const { addMedicine } = useMedicines();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [dose, setDose] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);
      await addMedicine(newMedicine);
      setName('');
      setType('');
      setDose('');
      setImage('');
      setDescription('');
      navigation.goBack();
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się dodać leku.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj lek</Text>

      <TextInput style={styles.input} placeholder="Nazwa leku" value={name} onChangeText={setName} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="Typ (tabletki, syrop...)" value={type} onChangeText={setType} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="Dawka (np. 500mg)" value={dose} onChangeText={setDose} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="URL obrazka" value={image} onChangeText={setImage} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="Opis" value={description} onChangeText={setDescription} placeholderTextColor="#ccc" />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAdd}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#1c1c1c" />
        ) : (
          <Text style={styles.buttonText}>Dodaj</Text>
        )}
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
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#1c1c1c',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default withAuthProtection(AddMedicineScreen);
