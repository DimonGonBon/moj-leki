import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { useMedicines } from '../context/MedicinesContext';
import { Ionicons } from '@expo/vector-icons';
import withAuthProtection from '../components/withAuthProtection';

function MedicineListScreen({ navigation }) {
  const { medicines, fetchMedicines, deleteMedicine } = useMedicines(); //Получаем список лек., функция загрузки/обновления списка, удаление лек. по айди
  const [refreshing, setRefreshing] = useState(false); //Состояние отвечает за скролл вниз(обновить страницу)

  const onRefresh = async () => { //Вызывается при потягивании списка \ перезагружает данные и выключает возможность обновлений
    setRefreshing(true);
    await fetchMedicines();
    setRefreshing(false);
  };

const handleDelete = (id) => { //Перед удалением выводит диалог окно, если юзер нажал Usuń то вызывается 37-38 строка
  Alert.alert(
    "Usuń lek",
    "Czy na pewno chcesz usunąć ten lek?",
    [
      {
        text: "Anuluj",
        style: "cancel"
      },
      {
        text: "Usuń",
        onPress: async () => {
          const { error } = await deleteMedicine(id);
          if (error) { // если ошибка то показывается алерт
            Alert.alert("Błąd", error.message || "Nie udało się usunąć leku.");
          }
        }
      }
    ]
  );
};

const renderItem = ({ item }) => ( //Каждый элемент списка передаётся в компонент медицинайтем
  <MedicineItem item={item} onDelete={handleDelete} navigation={navigation} />
);
function MedicineItem({ item, onDelete, navigation }) {    //Принимает объект лек. и функции перехода/удаления
  const [imageUri, setImageUri] = useState(item.image || 'https://via.placeholder.com/100'); //Если не указано изображение то ставит по умолчанию это

  return (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('MedicineDetails', { medicine: item })} // При нажатии на лек. переход к экрану деталий
    >
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        onError={() =>
          setImageUri('https://via.placeholder.com/100?text=Brak+obrazka')
        }
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>Typ: {item.type}</Text>
        <Text style={styles.detail}>Dawka: {item.dose}</Text>
        <Text style={styles.detail}>{item.taken ? 'Przyjęto' : 'Nieprzyjęto'}</Text>
      </View>
      <TouchableOpacity //Кнопка удаления, вызывает хандлделейт
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)} 
      >
        <Ionicons name="trash" size={24} color="#ff4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}



  return (
    <View style={styles.container}>
      <FlatList //Отображает лекарства и используется рендерайтем и поддержка обновления страниц через онрефреш
        data={medicines}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00cc66']}
            tintColor="#00cc66"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 10
  },
  name: {
    color: '#00ff99',
    fontSize: 18,
    fontWeight: 'bold'
  },
  detail: {
    color: '#ccc',
    fontSize: 14
  },
  deleteButton: {
    padding: 15,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }]
  }
});

export default withAuthProtection(MedicineListScreen); // Проверяет вошел ли юзер в систему если нет то перекинет на экран логина 
