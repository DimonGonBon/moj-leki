// src/screens/HomeStack.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function HomeStack() {
  const { logout } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1c1c1c' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Lista Zakupów',
          // Гарантируем, что слева ничего не отображается
          headerLeft: () => null,
          // Кнопка выхода только справа
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log('Logout button pressed');
                logout();
              }}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}