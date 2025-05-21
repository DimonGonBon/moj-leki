import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useMedicines } from '../context/MedicinesContext';

export default function PlanPrzyjecScreen() {
  const { medicines, fetchMedicines } = useMedicines();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMedicines();
    setRefreshing(false);
  };

  const scheduled = medicines
    .filter(med => med.reminder_time)
    .sort((a, b) => new Date(a.reminder_time) - new Date(b.reminder_time));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan przyjęć leków</Text>
      <FlatList
        data={scheduled}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00cc66']}
            tintColor="#00cc66"
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Brak zaplanowanych przypomnień.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>
              Przypomnienie: {new Date(item.reminder_time).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1c1c', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00cc66', marginBottom: 20 },
  item: { backgroundColor: '#333', padding: 15, borderRadius: 8, marginBottom: 10 },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  time: { color: '#ccc', fontSize: 14 },
  empty: { color: '#aaa', fontSize: 18, textAlign: 'center', marginTop: 50 },
});
