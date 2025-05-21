// --- src/screens/MedicineDetailsScreen.js ---
import React, { useState, useEffect } from 'react';
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

  const { medicines } = useMedicines();
  const medicine = paramMedicine || medicines.find(m => m.id === paramId);

  const [time, setTime] = useState(new Date(Date.now() + 5 * 60000));
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (medicine?.reminder_time) {
      const localTime = new Date(medicine.reminder_time);
      setTime(localTime);
    }
  }, [medicine]);

  const handleReminder = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Czas na lek 💊",
          body: "Nie zapomnij przyjąć leku!",
        },
        trigger: {
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: false,
        },
      });

      Alert.alert(
        "Przypomnienie ustawione",
        `Powiadomienie przyjdzie o ${time.toLocaleTimeString()}.`
      );
    } catch (error) {
      console.log("Błąd przypomnienia:", error);
      Alert.alert("Błąd", "Nie udało się ustawić przypomnienia.");
    }
  };

const handleSaveReminderTime = async () => {
  const localOffset = time.getTimezoneOffset();
  const localTime = new Date(time.getTime() - localOffset * 60000);

  const { error } = await supabase
    .from('medicines')
    .update({ reminder_time: localTime.toISOString() })
    .eq('id', medicine.id);

  if (error) {
    Alert.alert("Błąd", "Nie udało się zapisać przypomnienia.");
  } else {
    Alert.alert("Zapisano", `Przypomnienie ustawione na ${localTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', hour12: false })}`);
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
          onChange={onChange}
        />
      )}

      <TouchableOpacity onPress={handleReminder} style={styles.button}>
        <Text style={styles.buttonText}>Ustaw przypomnienie</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSaveReminderTime} style={styles.button}>
        <Text style={styles.buttonText}>Zapisz przypomnienie</Text>
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
