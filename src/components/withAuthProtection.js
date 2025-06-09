import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//Если пользователь не вошёл в систему — происходит автоматическая переадресация на экран входа

export default function withAuthProtection(WrappedComponent) { //Функция принимает компонент WrappedComponent, который должен быть защищён
  return function ProtectedComponent(props) { //Создаётся компонент ProtectedComponent, который управляет проверкой авторизации
    const { isLoggedIn, loading } = useAuth(); //Вошел ли пользователь + идет ли проверка авторизации
    const navigation = useNavigation(); //При ниобходимости перенаправлять

    useEffect(() => {
      if (!loading && !isLoggedIn) {
        navigation.replace('Login'); //После загрузки оказывается что юзер не залогинен перенаправление на экран логина
      }
    }, [loading, isLoggedIn]);

    if (loading || !isLoggedIn) { //Пока идет загрузка или пользователь не залогинен показывается спинер
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00cc66" /> 
        </View>
      );
    }

    return <WrappedComponent {...props} />; //Если всё ок то показывает защищенный компонент и передает ему все оригинальные пропсы
  };
}
//Стили
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
