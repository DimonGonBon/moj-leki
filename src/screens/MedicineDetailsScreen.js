import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MedicineDetailsScreen({ route }) {
  const { medicine } = route.params;
  const [time, setTime] = useState(new Date(Date.now() + 5 * 60 * 1000));
  const [showPicker, setShowPicker] = useState(false);

  const handleReminder = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Czas na lek 💊",
        body: "Nie zapomnij przyjąć leku!",
      },
      trigger: time,
    });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || time;
    setShowPicker(Platform.OS === 'ios');
    setTime(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{medicine.name}</Text>
      <Image
        source={{ uri: medicine.image || 'https://via.placeholder.com/200' }}
        style={styles.image}
      />
      <Text style={styles.text}>Typ: {medicine.type}</Text>
      <Text style={styles.text}>Dawka: {medicine.dose}</Text>
      <Text style={styles.text}>Opis: {medicine.description || 'Brak opisu'}</Text>
      <Text style={styles.status}>{medicine.taken ? 'Lek przyjęty' : 'Lek nieprzyjęty'}</Text>

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.button}>
        <Text style={styles.buttonText}>
          Wybierz czas: {time.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onChange}
        />
      )}

      <TouchableOpacity onPress={handleReminder} style={styles.button}>
        <Text style={styles.buttonText}>Ustaw przypomnienie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00cc66',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#00cc66',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
