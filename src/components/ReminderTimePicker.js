import React from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ReminderTimePicker({ time, show, setShow, onChange }) {
  return (
    <>
      <TouchableOpacity onPress={() => setShow(true)} style={{ backgroundColor: '#444', padding: 12, borderRadius: 10, marginTop: 10 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          Wybierz czas: {time.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </>
  );
}
