import React from 'react';
import { ProductProvider } from './src/context/ProductContext'; // Обёртка для глобального состояния
import HomeScreen from './src/screens/HomeScreen'; // Главный экран приложения

export default function App() {
  return (
    <ProductProvider>
      <HomeScreen />
    </ProductProvider>
  );
}
