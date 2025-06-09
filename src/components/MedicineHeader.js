import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function MedicineHeader({ medicine }) { //Компонент принимает один пропс\medicine — объект лекарства с полями name, image, type, dose, description, taken
  return ( //Показывает название лекарства в заголовке строка 8

    <View style={styles.container}>
      <Text style={styles.title}>{medicine.name}</Text> 
      <Image
        source={{ uri: medicine.image || 'https://via.placeholder.com/200' }} //Пытается загрузить изоб.по юрл из лекарства, если нет то ставит дефолт изоб.
        style={styles.image}
      />
      <Text style={styles.text}>Typ: {medicine.type}</Text> 
      <Text style={styles.text}>Dawka: {medicine.dose}</Text>
      <Text style={styles.text}>Opis: {medicine.description || 'Brak opisu'}</Text>
      <Text style={styles.status}>{medicine.taken ? 'Lek przyjęty' : 'Lek nieprzyjęty'}</Text>
    </View>
  );
//Проверяет логическое значение taken если тру то уже принял если фолс то напоминание актуально строка 16
}


//стили
const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#00cc66', marginBottom: 20 },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
  text: { fontSize: 18, color: '#fff', marginBottom: 10 },
  status: { fontSize: 16, color: '#fff', marginTop: 10, fontStyle: 'italic' },
});
