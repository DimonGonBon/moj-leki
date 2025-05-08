import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function AddMedicineScreen({ navigation }) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const { user } = useAuth();

  const handleAdd = async () => {
    if (!name || !dose || !time) {
      Alert.alert('Uwaga', 'Wypełnij wszystkie pola');
      return;
    }

    const { error } = await supabase.from('medicines').insert({
      name,
      dose,
      time,
      user_id: user.id,
    });

    if (error) Alert.alert('Błąd', error.message);
    else {
      Alert.alert('Sukces', 'Lek dodany!');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj lek</Text>
      <TextInput style={styles.input} placeholder="Nazwa leku" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Dawka" value={dose} onChangeText={setDose} />
      <TextInput style={styles.input} placeholder="Godzina" value={time} onChangeText={setTime} />

      <Button title="Dodaj" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 },
});
