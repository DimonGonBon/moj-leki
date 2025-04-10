// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Импорт экранов
import HomeStack from './src/screens/HomeStack'; // Оборачивает HomeScreen с видимым header и кнопкой "Wyloguj"
import AddProductScreen from './src/screens/AddProductScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';

// Импорт контекстов
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ProductsProvider } from './src/context/ProductsContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Add') iconName = 'add-circle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00cc66',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Заголовок для Tab Navigator не нужен, т.к. HomeStack предоставляет свой header
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Add" component={AddProductScreen} />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Szczegóły produktu' }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function RootNavigation() {
  const { isLoggedIn } = useAuth();
  console.log('RootNavigation, isLoggedIn:', isLoggedIn);
  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <RootNavigation />
      </ProductsProvider>
    </AuthProvider>
  );
}