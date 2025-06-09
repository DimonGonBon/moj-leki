import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { useMedicines } from '../context/MedicinesContext';
import withAuthProtection from '../components/withAuthProtection';
import { schedulePushNotification, registerForPushNotificationsAsync } from '../utils/NotificationService';

function AddMedicineScreen({ navigation }) {
  const { addMedicine } = useMedicines();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [dose, setDose] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

//Проверка на правильность написания пунктов при добавлении экрана
const handleAdd = async () => {
  if (!name || !type || !dose) {
    Alert.alert("Błąd", "Wprowadź nazwę, typ i dawkę leku.");
    return;
  }
//Создание объекта с данными лекарств что вписал user
  const newMedicine = {
    name,
    type,
    dose,
    image,
    description,
    reminder_time: reminderTime.toISOString(),
  };

  try {
    setLoading(true);

    //Вызов добавления лекарств и потом переход к СупаБейз через контекст
    const { data, error } = await addMedicine(newMedicine);
    if (error) {
      Alert.alert("Błąd", error.message || "Nie udało się dodać leku.");
      return;
    }
//Просим разрешение на уведомления + вычесляем сколько времени до напоминания и планируем пуш уведомления
    await registerForPushNotificationsAsync();

    const secondsUntilReminder = Math.max(
      1,
      Math.floor((reminderTime.getTime() - Date.now()) / 1000)
    );

    await schedulePushNotification({
      title: 'Mój Lek',
      body: `Czas wziąć lek: ${name}`,
      seconds: secondsUntilReminder
    });

//обнуляем форму и возвращаем на предыдущий экран
    setName('');
    setType('');
    setDose('');
    setImage('');
    setDescription('');
    setReminderTime(new Date());
    navigation.goBack();
  } catch (error) {
    console.error("Add medicine error:", error);
    Alert.alert("Błąd", "Nieoczekiwany problem.");
  } finally {
    setLoading(false);
  }
};
  return (

    //Стили строк
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj lek</Text>

      <TextInput style={styles.input} placeholder="Nazwa leku" value={name} onChangeText={setName} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="Typ (tabletki, syrop...)" value={type} onChangeText={setType} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="Dawka (np. 500mg)" value={dose} onChangeText={setDose} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="URL obrazka" value={image} onChangeText={setImage} placeholderTextColor="#ccc" />
      <TextInput style={styles.input} placeholder="Opis" value={description} onChangeText={setDescription} placeholderTextColor="#ccc" />

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timeButton}>
        <Text style={styles.timeButtonText}>Wybierz godzinę przypomnienia</Text>
        <Text style={styles.timePreview}>
          {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setReminderTime(selectedDate);
            }
          }}
        />
      )}

      <TouchableOpacity
      //Стиль загрузки и кнопки Добавить
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

//Стили экрана
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
  timeButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20
  },
  timeButtonText: {
    color: '#ccc',
    fontSize: 16
  },
  timePreview: {
    color: '#00ff99',
    fontSize: 18,
    marginTop: 5
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
