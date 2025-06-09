import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import MedicineStack from './src/screens/MedicineStack';
import AddMedicineScreen from './src/screens/AddMedicineScreen';
import MedicineDetailsScreen from './src/screens/MedicineDetailsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PlanPrzyjecScreen from './src/screens/PlanPrzyjecScreen';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { MedicinesProvider } from './src/context/MedicinesContext';
import { registerForPushNotificationsAsync } from './src/utils/NotificationService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//Отображение вкладок внизу, тех что календарь, домик и +
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Leki') iconName = 'medkit';
          else if (route.name === 'Dodaj') iconName = 'add-circle';
          else if (route.name === 'Plan') iconName = 'calendar';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00cc66',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Leki" component={MedicineStack} />
      <Tab.Screen name="Dodaj" component={AddMedicineScreen} />
      <Tab.Screen name="Plan" component={PlanPrzyjecScreen} />
    </Tab.Navigator>
  );
}
//Основная навигация, показывается после входа  и имеет 2 экрана 
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs" //Основное меню приложения
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicineDetails" //Экран деталий
        component={MedicineDetailsScreen}
        options={{ title: 'Szczegóły leku' }}
      />
    </Stack.Navigator>
  );
}

//Простой стек для показа экранов логина и регистрации если юзер не вошел (Первый запуск)
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
//Получаем статус входа и загрузки авторизации
function RootNavigation() {
  const { isLoggedIn, loading } = useAuth();

//Если ещё не обработан статус авторизации то показывает загрузку 
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00cc66" />
      </View>
    );
  }
//Если юзер не вошел то показывается стек Аутентификации, а если вошел то показывается основа АппСтек
  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

//Главный компонент, при запуске приложения запрашивается возможность на уведомления с помощью сто третей строки
export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

//Оборачиваем прогу в 2 контекста, первый Аутен.. управляет логином и регистрацией, выходом. Второй МедисинПровайдер добавление, удаление + редактирование.
  return (
    <AuthProvider>
      <MedicinesProvider>
        <RootNavigation />
      </MedicinesProvider>
    </AuthProvider>
  );
}

//Стили
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
