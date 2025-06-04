import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

 const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Błąd', 'Wprowadź email i hasło');
    return;
  }

  try {
    setIsLoading(true);
    const { error } = await login(email, password);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('invalid login credentials')) {
        Alert.alert('Błąd', 'Nieprawidłowy email lub hasło.');
      } else if (msg.includes('network')) {
        Alert.alert('Brak połączenia', 'Sprawdź swoje połączenie internetowe.');
      } else {
        Alert.alert('Błąd logowania', error.message || 'Coś poszło nie tak.');
      }
    }
  } catch (e) {
    Alert.alert('Błąd', 'Wystąpił nieoczekiwany problem.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <View style={styles.container}>
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
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: '#00cc66',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
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
  },
});
