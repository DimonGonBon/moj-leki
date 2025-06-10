import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useWindowDimensions, // добавлено для адаптации к горизонтальному экрану и верт
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

//Компонент регистрации пользователя, использует AuthContext и навигацию
export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { width, height } = useWindowDimensions(); // получаем размеры экрана
  const isPortrait = height >= width; // определяем текущую ориентацию

  const handleRegister = async () => { 
    //Так же как у Логина — асинхронная функция вызывается при нажатии на кнопку регистрации
    if (!email || !password) { // Проверка: если email или пароль не введены — выводим ошибку
      Alert.alert('Błąd', 'Wprowadź email i hasło');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await register(email, password); // пробуем зарегистрировать пользователя через Supabase

      if (error) {
        const msg = error.message.toLowerCase(); // анализируем сообщение ошибки
        if (msg.includes('user already registered')) {
          Alert.alert('Błąd', 'Ten email jest już zarejestrowany.');
        } else if (msg.includes('network')) {
          Alert.alert('Brak połączenia', 'Sprawdź swoje połączenie internetowe.');
        } else {
          Alert.alert('Błąd rejestracji', error.message || 'Coś poszło nie tak.');
        }
      } else {
        // Если регистрация прошла успешно
        Alert.alert('Sukces', 'Rejestracja zakończona sukcesem!');
        navigation.navigate('Login'); // переход к экрану входа
      }
    } catch (e) {
      Alert.alert('Błąd', 'Wystąpił nieoczekiwany problem.');
    } finally {
      setIsLoading(false);
    }
  };

return (
  <View style={isPortrait ? styles.container : styles.containerLandscape}>
    <View style={styles.formWrapper}>
      <Text style={styles.title}>Zarejestruj się</Text>

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
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#1c1c1c" />
        ) : (
          <Text style={styles.buttonText}>Zarejestruj</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Zaloguj się</Text>
      </TouchableOpacity>
    </View>
  </View>
);

}



//Стили для портретной и горизонтальной ориентации
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    padding: 20,
  },
  
  formWrapper: {
  width: '100%',
  maxWidth: 400,
  alignSelf: 'center',
},

  containerLandscape: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 26,
    color: '#00cc66',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    width: '100%'
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#00cc66',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#1c1c1c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#00aaff',
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
  },
});

