import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aktualne promocje i kupony</Text>
      {/* Здесь можно подключить ленту новостей */}
      <Text style={styles.placeholder}>Brak aktualnych informacji.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00cc66',
  },
  placeholder: {
    fontSize: 18,
    color: '#555',
  },
});
