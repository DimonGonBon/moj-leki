// Пример ProductsContext.js
import React, { createContext, useState, useContext } from 'react';

const ProductsContext = createContext({});

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Chleb",
      price: 4.99,
      store: "Biedronka",
      bought: false,
      image: "https://img.freepik.com/premium-photo/sliced-sourdough-bread-isolated-white-background-homemade-bakery-concept_875825-39328.jpg?w=996",
    },
    {
      id: "2",
      name: "Mleko",
      price: 2.50,
      store: "Lidl",
      bought: false,
      image: "https://niemirka.com/4363-large_default/mleko-laciate-32-1-litr-x-12-sztuk.jpg",
    },
    {
      id: "3",
      name: "Ser",
      price: 8.99,
      store: "Carrefour",
      bought: false,
      image: "https://polmlek.com/wp-content/uploads/2018/09/bloki-natan-300x266.png",
    }
  ]);

  const addProduct = (product) => {
    setProducts(prevProducts => [product, ...prevProducts]);
  };

  const updateProduct = (id, updatedFields) => {
    console.log("Обновление товара, id:", id, "новые поля:", updatedFields);
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts(prevProducts =>
      prevProducts.filter(p => p.id !== id)
    );
  };

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);