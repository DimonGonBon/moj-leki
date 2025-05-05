import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      Alert.alert('Błąd', 'Nie udało się pobrać produktów');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchProducts();
    }
  }, [isFocused]);

  const markAsBought = async (id) => {
    const { error } = await supabase
      .from('products')
      .update({ bought: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) fetchProducts();
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) fetchProducts();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.productItem, item.bought && styles.bought]} 
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/60' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, item.bought && styles.boughtText]}>{item.name}</Text>
        <Text style={[styles.productPrice, item.bought && styles.boughtText]}>{item.price} zł</Text>
        <Text style={[styles.productStore, item.bought && styles.boughtText]}>{item.store}</Text>
        <View style={styles.actionRow}>
          {!item.bought ? (
            <TouchableOpacity style={styles.buyButton} onPress={() => markAsBought(item.id)}>
              <Text style={styles.buyButtonText}>Kupić</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.boughtTag}>Kupione</Text>
          )}
          <TouchableOpacity onPress={() => deleteProduct(item.id)}>
            <Ionicons name="trash" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popularne produkty</Text>
      {loading ? (
        <Text style={{ color: '#fff', textAlign: 'center' }}>Ładowanie...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ color: '#888' }}>Brak produktów</Text>}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00ff99',
    marginBottom: 10,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  productPrice: {
    fontSize: 14,
    color: '#ccc',
  },
  productStore: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  buyButton: {
    backgroundColor: '#00ff99',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buyButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  boughtText: {
    color: '#777',
    textDecorationLine: 'line-through',
  },
  boughtTag: {
    color: '#00cc66',
    fontStyle: 'italic',
    fontSize: 12,
  },
});
