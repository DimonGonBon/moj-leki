import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  useWindowDimensions,// добавлено для адаптации к горизонтальному экрану и верт
} from 'react-native';
import { useMedicines } from '../context/MedicinesContext';
import withAuthProtection from '../components/withAuthProtection';

function PlanPrzyjecScreen() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const { medicines, fetchMedicines } = useMedicines();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMedicines();
    setRefreshing(false);
  };

  const scheduled = medicines //Отбор запланированых лекарств 
    .filter(med => !!med.reminder_time && !isNaN(new Date(med.reminder_time))) //Фильтр лекарств, ремайндтайм должен быть указан + должно быть валидной датой 
    .sort((a, b) => new Date(a.reminder_time) - new Date(b.reminder_time)); // Сортируем от самого ближнего до позднему

  const formatTime = (datetime) => { //Форматирование времени
    const date = new Date(datetime);
    return isNaN(date) ? 'Brak godziny' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); //отображение времени напоминания, если дата не коректна выводит Нет времени
  };

  return (//Показывает все запланированые лекарства//Каждое лекарство содержит название и время напоминания //Если нет ничего то показывает сообщение 
    <View style={isPortrait ? styles.container : styles.containerLandscape}>
      <Text style={styles.title}>Plan przyjęć leków</Text>
<FlatList
  data={scheduled}
  key={isPortrait ? 'p' : 'l'} // пересоздание списка при смене ориентации
  keyExtractor={item => item.id}
  numColumns={isPortrait ? 1 : 2}
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
        Przypomnienie: {formatTime(item.reminder_time)}
      </Text>
    </View>
  )}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1c1c', padding: 20 },
containerLandscape: {
  flex: 1,
  backgroundColor: '#1c1c1c',
  padding: 40,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
},
  title: { fontSize: 24, fontWeight: 'bold', color: '#00cc66', marginBottom: 20 },
item: {
  backgroundColor: '#333',
  padding: 15,
  borderRadius: 8,
  marginBottom: 10,
  flexGrow: 1,
  marginHorizontal: 5,
  minWidth: '48%'
},

  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  time: { color: '#ccc', fontSize: 14 },
  empty: { color: '#aaa', fontSize: 18, textAlign: 'center', marginTop: 50 },
});

export default withAuthProtection(PlanPrzyjecScreen);
