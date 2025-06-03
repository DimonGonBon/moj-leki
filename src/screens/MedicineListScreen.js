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
  const { medicines, fetchMedicines, deleteMedicine } = useMedicines();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMedicines();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
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
          onPress: () => deleteMedicine(id)
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('MedicineDetails', { medicine: item })}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>Typ: {item.type}</Text>
        <Text style={styles.detail}>Dawka: {item.dose}</Text>
        <Text style={styles.detail}>{item.taken ? 'Przyjęto' : 'Nieprzyjęto'}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash" size={24} color="#ff4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
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

export default withAuthProtection(MedicineListScreen);
