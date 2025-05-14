// --- src/screens/MedicineStack.js ---
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import MedicineListScreen from './MedicineListScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function MedicineStack() {
  const { logout } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1c1c1c' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="MedicineList"
        component={MedicineListScreen}
        options={{
          title: 'Moje Leki',
          headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity
              onPress={logout}
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
