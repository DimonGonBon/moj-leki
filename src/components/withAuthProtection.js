import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function withAuthProtection(WrappedComponent) {
  return function ProtectedComponent(props) {
    const { isLoggedIn, loading } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
      if (!loading && !isLoggedIn) {
        navigation.replace('Login');
      }
    }, [loading, isLoggedIn]);

    if (loading || !isLoggedIn) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00cc66" />
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
