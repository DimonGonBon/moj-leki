import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMedicines } from '../context/MedicinesContext';
import MedicineHeader from '../components/MedicineHeader';
import ReminderTimePicker from '../components/ReminderTimePicker';
import ActionButton from '../components/ActionButton';
import useMedicineActions from '../hooks/useMedicineActions';

export default function MedicineDetailsScreen({ route }) {
  const paramMedicine = route.params?.medicine;
  const paramId = route.params?.id;

  const { medicines, fetchMedicines, updateMedicine } = useMedicines();
  const medicine = paramMedicine || medicines.find(m => m.id === paramId);

  const [time, setTime] = useState(
    medicine?.reminder_time ? new Date(medicine.reminder_time) : new Date(Date.now() + 5 * 60000)
  );
  const [showPicker, setShowPicker] = useState(false);

  const { handleSaveAndNotify, handleMarkAsTaken, handleShare } = useMedicineActions({
    medicine, time, updateMedicine, fetchMedicines, setTime,
  });

  const onChange = (_, selectedDate) => {
    const currentDate = selectedDate || time;
    setShowPicker(false);
    setTime(currentDate);
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
      <MedicineHeader medicine={medicine} />
      <ReminderTimePicker time={time} show={showPicker} setShow={setShowPicker} onChange={onChange} />
      <ActionButton title="Ustaw i zapisz przypomnienie" onPress={handleSaveAndNotify} />
      <ActionButton title="Przyjęto" onPress={() => handleMarkAsTaken()} />
      <ActionButton title="Udostępnij" onPress={handleShare} color="#00aaff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
