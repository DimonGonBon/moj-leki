
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import MedicineListScreen from './MedicineListScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function MedicineStack() {
  const { logout } = useAuth(); //Получаем функцию выхода из системы и очищает текущего пользователя и сбрасывает сессиию

  return (
    <Stack.Navigator //Просто создает стек с общим стилем заголовка
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
          headerLeft: () => null, //убираем кнопку назад что бы юзер не мог вернутся нажав на левую часть экрана
          headerRight: () => ( //Кнопка выхода, вызывает логаут 
            <View style={{ marginRight: 10 }}>
              <TouchableOpacity onPress={logout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="log-out" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
