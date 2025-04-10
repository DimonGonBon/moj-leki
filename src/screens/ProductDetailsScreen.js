import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProductDetailsScreen({ route }) {
  const { product } = route.params;
  console.log("Product details:", product); // Для проверки, что описание передаётся

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Image 
        source={{ uri: product.image || 'https://via.placeholder.com/200' }} 
        style={styles.image} 
      />
      <Text style={styles.text}>Cena: {product.price} zł</Text>
      <Text style={styles.text}>Sklep: {product.store}</Text>
      <Text style={styles.description}>
        Opis: {product.description || "Brak opisu"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00cc66',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    fontStyle: 'italic',
  },
});