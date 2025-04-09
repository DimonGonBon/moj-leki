import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SectionList, StyleSheet, Alert, ImageBackground } from 'react-native';

export default function App() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [storeName, setStoreName] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const addProduct = () => {
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
    };

    setProducts([newProduct, ...products]);
    setProductName('');
    setProductPrice('');
    setStoreName('');
    setFiltersVisible(true); 
  };

  const toggleBought = () => {
    if (!selectedProduct) return;

    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p =>
        p.id === selectedProduct ? { ...p, bought: true } : p
      );
      return [...updatedProducts.filter(p => !p.bought), ...updatedProducts.filter(p => p.bought)];
    });

    setSelectedProduct(null);
  };

  const deleteProduct = (id) => {
    setProducts(prevProducts => {
      const newProducts = prevProducts.filter(p => p.id !== id);
      if (newProducts.length === 0) setFiltersVisible(false);
      return newProducts;
    });
    if (selectedProduct === id) setSelectedProduct(null);
  };

  const filteredProducts = products.filter(p => 
    (!filterStore || p.store.toLowerCase().includes(filterStore.toLowerCase())) &&
    (!filterPrice || (!isNaN(parseFloat(filterPrice.replace(',', '.'))) && p.price === parseFloat(filterPrice.replace(',', '.'))))
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const section = acc.find(s => s.store === product.store);
    if (section) {
      section.data.push(product);
    } else {
      acc.push({ store: product.store, data: [product] });
    }
    return acc;
  }, []);

  return (

      <View style={styles.container}>
        <Text style={styles.title}></Text>

        {filtersVisible && (
          <>
            <TextInput 
              style={styles.input} 
              placeholder="Filtruj po sklepie..." 
              value={filterStore} 
              onChangeText={setFilterStore} 
              placeholderTextColor="#ccc" 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Filtruj po cenie (zł)..." 
              value={filterPrice} 
              onChangeText={setFilterPrice} 
              keyboardType="numeric" 
              placeholderTextColor="#ccc" 
            />
          </>
        )}

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
          placeholder="Cena (zł)..." 
          value={productPrice} 
          onChangeText={setProductPrice} 
          keyboardType="numeric" 
          placeholderTextColor="#ccc" 
        />
        <Text style={styles.hint}>Podaj cenę jako liczbę, np. 12.99</Text>

        <TouchableOpacity 
          style={[styles.button, (!productName || !productPrice || !storeName) && styles.buttonDisabled]} 
          onPress={addProduct} 
          disabled={!productName || !productPrice || !storeName}
        >
          <Text style={styles.buttonText}>Dodaj towar</Text>
        </TouchableOpacity>

        <SectionList
          sections={groupedProducts}
          keyExtractor={item => item.id}
          renderSectionHeader={({ section: { store } }) => <Text style={styles.sectionTitle}>{store}</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.item, item.bought && styles.bought, selectedProduct === item.id && styles.selected]} 
              onPress={() => !item.bought && setSelectedProduct(item.id)}
            >
              <Text style={styles.itemText}>{item.bought ? '✔ ' : ''}{item.name} - {item.price} zł</Text>
              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <Text style={styles.trashIcon}>🗑️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity 
          style={[styles.button, !selectedProduct && styles.buttonDisabled]} 
          onPress={toggleBought} 
          disabled={!selectedProduct}
        >
          <Text style={styles.buttonText}>Kupić towar</Text>
        </TouchableOpacity>
      </View>

  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
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
  hint: { 
    fontSize: 12, 
    color: '#bbb', 
    marginBottom: 10 
  },
  sectionTitle: { 
    fontSize: 22, 
    color: '#00ff99', 
    fontWeight: 'bold', 
    marginTop: 20, 
    marginBottom: 10 
  },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    width: '80%', 
    borderRadius: 12, 
    backgroundColor: '#222', 
    marginBottom: 12 
  },
  bought: { 
    backgroundColor: '#00cc66' 
  },
  selected: { 
    backgroundColor: '#00cc66' 
  },
  itemText: { 
    fontSize: 18, 
    color: '#fff', 
    flex: 1 
  },
  trashIcon: { 
    fontSize: 20, 
    color: '#F44336' 
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
  },
});
