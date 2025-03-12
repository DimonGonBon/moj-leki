import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const storedProducts = await loadProducts();
      setProducts(storedProducts);
    };
    fetchProducts();
  }, []);

  const addProduct = (product) => {
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    saveProducts(updatedProducts); // Сохраняем в AsyncStorage
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

const saveProducts = async (products) => {
  try {
    await AsyncStorage.setItem('products', JSON.stringify(products));
  } catch (e) {
    console.error(e);
  }
};

const loadProducts = async () => {
  try {
    const storedProducts = await AsyncStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export default ProductContext;
