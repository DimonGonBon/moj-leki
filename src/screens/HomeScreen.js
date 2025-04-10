import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { products, updateProduct, deleteProduct } = useProducts();
  const { logout } = useAuth();

  const markAsBought = (id) => {
    updateProduct(id, { bought: true });
  };

  const renderItem = ({ item }) => (
    <View style={[styles.productItem, item.bought && styles.bought]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Image
          source={{
            uri: item.image && item.image !== "" ? item.image : 'https://via.placeholder.com/60',
          }}
          style={styles.productImage}
        />
      </TouchableOpacity>
      <View style={styles.productDetails}>
        <Text style={[styles.productName, item.bought && styles.boughtText]}>
          {item.name}
        </Text>
        <Text style={[styles.productPrice, item.bought && styles.boughtText]}>
          {item.price} zł
        </Text>
        <Text style={[styles.productStore, item.bought && styles.boughtText]}>
          {item.store}
        </Text>
        <View style={styles.actionRow}>
          {!item.bought ? (
            <TouchableOpacity style={styles.buyButton} onPress={() => markAsBought(item.id)}>
              <Text style={styles.buyButtonText}>Kupić</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.alreadyBought}>Kupione</Text>
          )}
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(item.id)}>
            <Ionicons name="trash" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popularne produkty</Text>
      <FlatList 
        data={products} 
        keyExtractor={(item) => item.id} 
        renderItem={renderItem} 
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
    backgroundColor: '#2c2c2c',
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
    color: '#fff',
  },
  productPrice: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  productStore: {
    fontSize: 14,
    color: '#ccc',
  },
  boughtText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#00cc66',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    width: 100,
  },
  buyButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  alreadyBought: {
    fontSize: 16,
    color: '#00cc66',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 15,
  },
  bought: {
    backgroundColor: '#333',
  },
});