import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useProducts } from '../context/ProductsContext';

export default function AddProductScreen() {
  const { addProduct } = useProducts();

  const [storeName, setStoreName] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleAddProduct = () => {
    if (!productName || !storeName) {
      Alert.alert("Błąd", "Podaj nazwę produktu i sklep.");
      return;
    }

    const price = parseFloat(productPrice.replace(',', '.'));
    if (isNaN(price)) {
      Alert.alert("Błąd", "Podaj poprawną cenę jako liczbę (np. 12.99).");
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      price,
      store: storeName,
      bought: false,
      image: imageUrl ? imageUrl : "",
      description: description ? description : "",
    };

    addProduct(newProduct);

    setStoreName('');
    setProductName('');
    setProductPrice('');
    setImageUrl('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj produkt</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Sklep..." 
        value={storeName} 
        onChangeText={setStoreName} 
        placeholderTextColor="#ccc" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Nazwa produktu..." 
        value={productName} 
        onChangeText={setProductName} 
        placeholderTextColor="#ccc" 
      />
      <TextInput
        style={styles.input}
        placeholder="URL obrazka (opcjonalnie)..."
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholderTextColor="#ccc"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Cena (zł)..." 
        value={productPrice} 
        onChangeText={setProductPrice} 
        keyboardType="numeric" 
        placeholderTextColor="#ccc" 
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Opis produktu (opcjonalnie)..."
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="#ccc"
        multiline={true}
      />
      <Text style={styles.hint}>Podaj cenę jako liczbę, np. 12.99</Text>
      
      <TouchableOpacity 
        style={[styles.button, (!productName || !productPrice || !storeName) && styles.buttonDisabled]} 
        onPress={handleAddProduct} 
        disabled={!productName || !productPrice || !storeName}
      >
        <Text style={styles.buttonText}>Dodaj produkt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
    alignItems: 'center'
  },
  title: { 
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00ff99',
    textAlign: 'center'
  },
  input: { 
    width: '80%',
    borderWidth: 1,
    borderColor: '#00ff99',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center'
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top'
  },
  hint: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 10
  },
  button: { 
    width: '80%',
    padding: 15,
    backgroundColor: '#00ff99',
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#555'
  },
  buttonText: { 
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: 'bold'
  }
});