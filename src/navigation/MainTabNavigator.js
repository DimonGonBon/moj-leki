import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MedicineListScreen from '../screens/MedicineListScreen';
import AddMedicineScreen from '../screens/AddMedicineScreen';
import MedicineDetailsScreen from '../screens/MedicineDetailsScreen';

import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const AuthStack = () => ( //Стек для незалогиненых
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);


const AppStack = () => ( //Стек для залогиненых
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={MedicineListScreen}
      options={{ title: 'MójLeki' }}
    />
    <Stack.Screen
      name="AddMedicine"
      component={AddMedicineScreen}
      options={{ title: 'Dodaj lek' }}
    />
    <Stack.Screen
      name="MedicineDetails"
      component={MedicineDetailsScreen}
      options={{ title: 'Szczegóły leków' }}
    />
  </Stack.Navigator>
);

export default function Navigation() {
  const { isLoggedIn, loading } = useAuth(); //isLoggedIn значение вошел ли юзер, лоадинг флаг пока не проверена сессия
  console.log('Navigation, isLoggedIn:', isLoggedIn, 'loading:', loading);

  if (loading) return <LoadingScreen />;  //Пока загружается информация о сессии показывается загрузочный экран

  return (//Если юзер залогинен показывает Аппстак если нет аутентстак
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />} 
    </NavigationContainer>
  );
}
