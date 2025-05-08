import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen'; // пока можно просто заглушку
import AddMedicineScreen from '../screens/AddMedicineScreen'; // заглушка, позже наполним

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddMedicine" component={AddMedicineScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <AppStack /> : <AuthStack />;
}
