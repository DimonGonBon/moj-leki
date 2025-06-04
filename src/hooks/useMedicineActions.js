import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';

export default function useMedicineActions({ medicine, time, updateMedicine, fetchMedicines, setTime }) {
  const handleSaveAndNotify = async () => {
    const now = new Date();
    const selectedTime = new Date(time);

    if (selectedTime < now) {
      selectedTime.setDate(selectedTime.getDate() + 1);
      setTime(selectedTime);
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Czas na lek 💊",
          body: `Nie zapomnij przyjąć leku: ${medicine.name}`,
        },
        trigger: selectedTime,
      });

      const { error } = await updateMedicine(medicine.id, {
        reminder_time: selectedTime.toISOString(),
      });

      if (error) {
        Alert.alert("Błąd", error.message || "Nie udało się zapisać zmiany.");
        return;
      }

      const isTomorrow = selectedTime.getDate() !== now.getDate();
      Alert.alert(
        "Zapisano",
        `Przypomnienie ustawione na ${selectedTime.toLocaleTimeString()} ${isTomorrow ? "(jutro)" : ""}`
      );

      fetchMedicines();
    } catch (error) {
      console.error("Błąd zapisu:", error);
      Alert.alert("Błąd", "Nie udało się ustawić przypomnienia.");
    }
  };

  const handleMarkAsTaken = async (intervalHours = 8) => {
    const nextTime = new Date(time);
    nextTime.setHours(nextTime.getHours() + intervalHours);

    const { error } = await updateMedicine(medicine.id, {
      taken: true,
      reminder_time: nextTime.toISOString(),
    });

    if (error) {
      Alert.alert("Błąd", error.message || "Nie udało się zapisać zmiany.");
    } else {
      Alert.alert("Zapisano", `Następna dawka o ${nextTime.toLocaleTimeString()}`);
      fetchMedicines();
    }
  };

  const handleShare = async () => {
    const deepLink = Linking.createURL(`medicine/${medicine.id}`);
    await Clipboard.setStringAsync(deepLink);
    Alert.alert('Link skopiowany', deepLink);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync('', {
        dialogTitle: 'Udostępnij link',
        url: deepLink,
      });
    }
  };

  return { handleSaveAndNotify, handleMarkAsTaken, handleShare };
}
