import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';

export default function useMedicineActions({ medicine, time, updateMedicine, fetchMedicines, setTime }) {
  const handleSaveAndNotify = async () => { //установить напоминание
    const now = new Date(); //Берём текущее и выбранное время
    const selectedTime = new Date(time);

    if (selectedTime < now) { //Если пользователь выбрал прошедшее время переносим его на следующий день
      selectedTime.setDate(selectedTime.getDate() + 1);
      setTime(selectedTime);
    }

    try {
      await Notifications.scheduleNotificationAsync({ //Планируем локальное уведомление в expo-notifications
        content: {
          title: "Czas na lek 💊",
          body: `Nie zapomnij przyjąć leku: ${medicine.name}`,
        },
        trigger: selectedTime,
      });

      const { error } = await updateMedicine(medicine.id, {
        reminder_time: selectedTime.toISOString(), //Сохраняем новое время в базу данных
      });

      if (error) {
        Alert.alert("Błąd", error.message || "Nie udało się zapisać zmiany.");
        return;
      }

      const isTomorrow = selectedTime.getDate() !== now.getDate();
      Alert.alert(
        "Zapisano",
        `Przypomnienie ustawione na ${selectedTime.toLocaleTimeString()} ${isTomorrow ? "(jutro)" : ""}` //Показываем пользователю подтверждение и обновляем список лекарств
      );

      fetchMedicines();
    } catch (error) {
      console.error("Błąd zapisu:", error);
      Alert.alert("Błąd", "Nie udało się ustawić przypomnienia.");
    }
  };

  const handleMarkAsTaken = async (intervalHours = 8) => { //По умолчанию следующее напоминание будет через 8 часов
    const nextTime = new Date(time);
    nextTime.setHours(nextTime.getHours() + intervalHours); //Считаем новое время

    const { error } = await updateMedicine(medicine.id, { //Сохраняем статус taken: true и обновлённое время
      taken: true,
      reminder_time: nextTime.toISOString(),
    });

    if (error) {
      Alert.alert("Błąd", error.message || "Nie udało się zapisać zmiany.");
    } else {
      Alert.alert("Zapisano", `Następna dawka o ${nextTime.toLocaleTimeString()}`); //Подтверждаем пользователю и обновляем список
      fetchMedicines();
    }
  };

  const handleShare = async () => {
    const deepLink = Linking.createURL(`medicine/${medicine.id}`); //Создаём deep link, копируем его в буфер обмена и показываем уведомление
    await Clipboard.setStringAsync(deepLink);
    Alert.alert('Link skopiowany', deepLink);

    if (await Sharing.isAvailableAsync()) { //Если доступен модуль Sharing, открываем диалог системы для отправки ссылки
      await Sharing.shareAsync('', {
        dialogTitle: 'Udostępnij link',
        url: deepLink,
      });
    }
  };

  return { handleSaveAndNotify, handleMarkAsTaken, handleShare }; //Хук возвращает объект с 3 готовыми функциями
}
