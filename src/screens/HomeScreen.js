import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const products = [
  {
    id: '1',
    name: 'Chleb',
    price: '4.99 zł',
    store: 'Biedronka',
    image: 'https://img.freepik.com/premium-photo/sliced-sourdough-bread-isolated-white-background-homemade-bakery-concept_875825-39328.jpg?w=996', // Замените на актуальный URL
  },
  {
    id: '2',
    name: 'Mleko',
    price: '2.50 zł',
    store: 'Lidl',
    image: 'https://niemirka.com/4363-large_default/mleko-laciate-32-1-litr-x-12-sztuk.jpg', // Замените на актуальный URL
  },
  {
    id: '3',
    name: 'Ser żółty',
    price: '8.99 zł',
    store: 'Carrefour',
    image: 'https://polmlek.com/wp-content/uploads/2018/09/bloki-natan-300x266.png', // Замените на актуальный URL
  },
  {
    id: '4',
    name: 'Kabanosy',
    price: '3.50 zł',
    store: 'Auchan',
    image: 'https://leclerc24.pl/public/upload/sellasist_cache/original_86cc22709128303d6902f60a6e939d66-jpg.webp', // Замените на актуальный URL
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popularne produkty</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <Text style={styles.productStore}>{item.store}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00cc66',
    textAlign: 'center',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
  productStore: {
    fontSize: 14,
    color: '#555',
  },
});
