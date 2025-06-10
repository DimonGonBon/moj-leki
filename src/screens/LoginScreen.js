import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useWindowDimensions // добавлено для адаптации к горизонтальному экрану и верт
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

//Храним емайл и пароль и статус загрузки - тру показывает спинер и отключает кнопки
export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const { login } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //Функция асинхронная вызывается при нажатии Войти
  const handleLogin = async () => {
    //Если поля емайл и пароль пустые то выдаем ошибку
    if (!email || !password) {
      Alert.alert('Błąd', 'Wprowadź email i hasło');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await login(email, password); //Ставим флаг загрузки и пробуем войти через логин
      if (error) {
        const msg = error.message.toLowerCase(); //Если ошибка есть то анализируем её и в зависимости от ошибки показываем сообщение
        if (msg.includes('invalid login credentials')) {
          Alert.alert('Błąd', 'Nieprawidłowy email lub hasło.');
        } else if (msg.includes('network')) {
          Alert.alert('Brak połączenia', 'Sprawdź swoje połączenie internetowe.');
        } else {
          Alert.alert('Błąd logowania', error.message || 'Coś poszło nie tak.');
        }
      }
    } catch (e) { //Если произошло исключение то показываем ошибку и сбрасываем загрузку
      Alert.alert('Błąd', 'Wystąpił nieoczekiwany problem.');
    } finally {
      setIsLoading(false);
    }
  };

  //Стили
  return (
    <View style={isPortrait ? styles.container : styles.containerLandscape}>
      <Text style={styles.title}>Zaloguj się</Text>
      

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#1c1c1c" />
        ) : (
          <Text style={styles.buttonText}>Zaloguj</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#1c1c1c',
  justifyContent: 'center',
  alignItems: 'center',       
  padding: 20,
},

title: {
  fontSize: 26,
  color: '#00cc66',
  fontWeight: 'bold',
  marginBottom: 30,
  marginTop: 20,               
  textAlign: 'center',
  width: '100%',
},

containerLandscape: {
  flex: 1,
  backgroundColor: '#1c1c1c',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 40,
},

input: {
  backgroundColor: '#2c2c2c',
  color: '#fff',
  padding: 12,
  borderRadius: 10,
  marginBottom: 12,
  fontSize: 16,
  width: 300               
},

button: {
  backgroundColor: '#00cc66',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 15,
  width: 300              
},

linkText: {
  color: '#00aaff',
  textAlign: 'center',
  marginTop: 10,
  width: 300            
}
});
