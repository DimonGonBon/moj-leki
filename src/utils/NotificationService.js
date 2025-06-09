
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


export async function registerForPushNotificationsAsync() { //Получаем текущее разрешение на уведомление. Если есть то используем его
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') { //Если нет то делаем запрос у юзера
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') { //Если отклонено то выводим Алерт
    alert('Brak zgody na powiadomienia!');
    return;
  }
}


export async function schedulePushNotification({ title, body, seconds }) { //Создание уведомления
  await Notifications.scheduleNotificationAsync({
    content: { title, body }, //Текст
    trigger: { seconds, repeats: false } //Задержка в секундах + однокартное уведомление
  });
}


export async function cancelAllScheduledNotifications() { //Удаление всех уведомлений при выходе из аккаунта или сбросе данных
  await Notifications.cancelAllScheduledNotificationsAsync();
}


export async function getAllScheduledNotifications() {//Вывод в консоль всех запланированых уведомлений
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('Zaplanowane notyfikacje:', scheduled);
}
