import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'; //useWindowDimensions добавлено для адаптации к горизонтальному экрану и верт
import { useMedicines } from '../context/MedicinesContext';
import MedicineHeader from '../components/MedicineHeader';
import ReminderTimePicker from '../components/ReminderTimePicker';
import ActionButton from '../components/ActionButton';
import useMedicineActions from '../hooks/useMedicineActions';
import { ScrollView } from 'react-native';

export default function MedicineDetailsScreen({ route }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const paramMedicine = route.params?.medicine; //Извлекает объект лекарства или айди
  const paramId = route.params?.id;

  const { medicines, fetchMedicines, updateMedicine } = useMedicines(); //Получаем список лек., обновление списка, обновление лек.
  const medicine = paramMedicine || medicines.find(m => m.id === paramId); //Если лекарство передано полным то используем если нет то ищем по айди

  const [time, setTime] = useState(
    medicine?.reminder_time ? new Date(medicine.reminder_time) : new Date(Date.now() + 5 * 60000) //текущее выбраное время напоминания и +5 минут от текущего 
  );
  const [showPicker, setShowPicker] = useState(false); //Видимость выбора времени

  const { handleSaveAndNotify, handleMarkAsTaken, handleShare } = useMedicineActions({ //Хук юзерМедисинакшон возвращает методы сохранить и запланировать, отметить как принято, ссылка на лекарство
    medicine, time, updateMedicine, fetchMedicines, setTime,
  });

  const onChange = (_, selectedDate) => { //Обновляет выбарное время в DateTimePicker
    const currentDate = selectedDate || time;
    setShowPicker(false);
    setTime(currentDate);
  };

  if (!medicine) { //Если лек. не найдено выводит ошибку
    return (
      <View style={isPortrait ? styles.container : styles.containerLandscape}>
        <Text style={styles.text}>Nie znaleziono leku</Text>
      </View>
    );
  }

  //Стили
return (
  <ScrollView contentContainerStyle={isPortrait ? styles.container : styles.containerScrollLandscape}>
    <MedicineHeader medicine={medicine} />
    <ReminderTimePicker time={time} show={showPicker} setShow={setShowPicker} onChange={onChange} />
    <ActionButton title="Ustaw i zapisz przypomnienie" onPress={handleSaveAndNotify} />
    <ActionButton title="Przyjęto" onPress={() => handleMarkAsTaken()} />
    <ActionButton title="Udostępnij" onPress={handleShare} color="#00aaff" />
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
  },

  containerScrollLandscape: {
  padding: 40,
  backgroundColor: '#1c1c1c',
  alignItems: 'center',
  justifyContent: 'center',
},

  containerLandscape: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
