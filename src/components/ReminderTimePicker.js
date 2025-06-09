import React from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ReminderTimePicker({ time, show, setShow, onChange }) { //текущее выбранное время + флаг показывает ли DateTimePicker, функция для отображения/скрытия выбора времени, функция обрабатывающая выбора времени
  return (

    //Отображается текст с текущим временем в формате час/минуты. По нажатию — показываем пикер
    <>
      <TouchableOpacity onPress={() => setShow(true)} style={{ backgroundColor: '#444', padding: 12, borderRadius: 10, marginTop: 10 }}> 
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          Wybierz czas: {time.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>

      {show && ( //Пикер //Если show = true показывается DateTimePicker
        <DateTimePicker
          value={time}
          mode="time" //отображается в режиме времени
          display={Platform.OS === 'ios' ? 'spinner' : 'default'} //стиль зависит от платформы
          is24Hour={true} //используется 24-часовой формат
          onChange={onChange} //при выборе нового времени вызывается onChange
        />
      )}
    </>
  );
}
