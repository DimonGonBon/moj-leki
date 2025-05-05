import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddProductScreen from './screens/AddProductScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';

import { useAuth } from './context/AuthContext';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Lista Zakupów' }}
    />
    <Stack.Screen
      name="AddProduct"
      component={AddProductScreen}
      options={{ title: 'Dodaj produkt' }}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetailsScreen}
      options={{ title: 'Szczegóły produktu' }}
    />
  </Stack.Navigator>
);

export default function Navigation() {
  const { isLoggedIn, loading } = useAuth();
  console.log('Navigation, isLoggedIn:', isLoggedIn, 'loading:', loading);

  if (loading) return <LoadingScreen />; // Можно заменить на <LoadingScreen /> или спиннер

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
