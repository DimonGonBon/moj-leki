import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { logout, user } = useAuth();
  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = useCallback(async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
  
    if (!error) {
      setMedicines(data);
    } else {
      console.error('Fetch error:', error);
    }
  }, [user.id]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchMedicines);
    return unsubscribe;
  }, [navigation, fetchMedicines]);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twoje leki</Text>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Dawka: {item.dose} o {item.time}</Text>
          </View>
        )}
      />
      <Button title="Dodaj lek" onPress={() => navigation.navigate('AddMedicine')} />
      <Button title="Wyloguj się" onPress={logout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { padding: 10, borderBottomWidth: 1 },
  name: { fontWeight: 'bold' },
});
