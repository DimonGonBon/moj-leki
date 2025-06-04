
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Brak zgody na powiadomienia!');
    return;
  }
}


export async function schedulePushNotification({ title, body, seconds }) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds, repeats: false }
  });
}


export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}


export async function getAllScheduledNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('Zaplanowane notyfikacje:', scheduled);
}
