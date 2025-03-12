import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  // Пример данных для списка
  const products = [
    { id: 1, name: 'Chleb', store: 'Biedronka', bought: false },
    { id: 2, name: 'Mleko', store: 'Lidl', bought: true },
  ];

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <Text style={styles.title}>Lista Zakupów</Text>

      {/* Список продуктов */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productText}>
              {item.name} - {item.store} ({item.bought ? 'Kupione' : 'Nie kupione'})
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>{item.bought ? 'Oznacz jako nie kupione' : 'Oznacz jako kupione'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Кнопка добавления */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Dodaj produkt</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#343a40',
  },
  productItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productText: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
