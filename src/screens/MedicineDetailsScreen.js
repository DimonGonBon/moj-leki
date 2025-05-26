// --- src/screens/MedicineDetailsScreen.js ---
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../lib/supabase';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import { useRoute } from '@react-navigation/native';
import { useMedicines } from '../context/MedicinesContext';


export default function MedicineDetailsScreen({ route: navRoute }) {
  const route = useRoute();
  const paramMedicine = navRoute.params?.medicine;
  const paramId = navRoute.params?.id;

  const { medicines, fetchMedicines } = useMedicines();

  const medicine = paramMedicine || medicines.find(m => m.id === paramId);

  const [time, setTime] = useState(
    medicine?.reminder_time ? new Date(medicine.reminder_time) : new Date(Date.now() + 5 * 60000)
  );
  const [showPicker, setShowPicker] = useState(false);
  const [intervalHours, setIntervalHours] = useState(8);

  const handleSaveAndNotify = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Czas na lek 💊",
          body: "Nie zapomnij przyjąć leku!",
        },
        trigger: time,
      });


      const { error } = await supabase
        .from('medicines')
        .update({ reminder_time: time.toISOString() })
        .eq('id', medicine.id);

      if (error) throw error;

      Alert.alert("Zapisano", `Przypomnienie ustawione na ${time.toLocaleTimeString()}`);
      fetchMedicines();
    } catch (error) {
      console.log("Błąd zapisu/przypomnienia:", error);
      Alert.alert("Błąd", "Nie udało się ustawić przypomnienia.");
    }
  };

  const handleMarkAsTaken = async () => {
    const nextTime = new Date(time);
    nextTime.setHours(nextTime.getHours() + intervalHours);

    const { error } = await supabase
      .from('medicines')
      .update({ 
        taken: true,
        reminder_time: nextTime.toISOString()
      })
      .eq('id', medicine.id);

    if (error) {
      Alert.alert("Błąd", "Nie udało się zapisać zmiany.");
    } else {
      Alert.alert("Zapisano", `Następna dawka o ${nextTime.toLocaleTimeString()}`);
      fetchMedicines();
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || time;
    setShowPicker(Platform.OS === 'ios');
    setTime(currentDate);
  };

  const handleShare = async () => {
    const deepLink = Linking.createURL(`medicine/${medicine.id}`);

    await Clipboard.setStringAsync(deepLink);
    Alert.alert('Link skopiowany', deepLink);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync('', { dialogTitle: 'Udostępnij link', url: deepLink });
    }
  };

  if (!medicine) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Nie znaleziono leku</Text>
      </View>
    );
  }

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
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <TouchableOpacity onPress={handleSaveAndNotify} style={styles.button}>
        <Text style={styles.buttonText}>Ustaw i zapisz przypomnienie</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleMarkAsTaken} style={styles.button}>
        <Text style={styles.buttonText}>Przyjęto</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Udostępnij</Text>
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
  shareButton: {
    backgroundColor: '#00aaff',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
