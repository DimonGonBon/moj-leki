import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

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

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicineDetails"
        component={MedicineDetailsScreen}
        options={{ title: 'Szczegóły leku' }}
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
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function RootNavigation() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00cc66" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}


export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <AuthProvider>
      <MedicinesProvider>
        <RootNavigation />
      </MedicinesProvider>
    </AuthProvider>
  );
}
