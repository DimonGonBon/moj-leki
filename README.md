# Mój Leki — Aplikacja mobilna do zarządzania lekami.

 Aplikacja mobilna stworzona w React Native do zarządzania przyjmowaniem leków, ustawiania przypomnień, przeglądania szczegółów oraz obsługi kont użytkowników.



 - Rejestracja i logowanie użytkowników (Supabase)
 - Warunkowa nawigacja i odzyskiwanie sesji
 - Lista leków z obrazkami i statusem przyjęcia
 - Szczegóły leku z możliwością ustawienia przypomnienia
 - Obsługa powiadomień push
 - Deep Linking (`mojleki://medicine/:id`)
 - Udostępnianie linków do leków
 - Niestandardowe animacje ekranów
 - Tryb offline dla zapisanych danych


# 1. Zainstaluj zależności:
 npm install
 2. Uruchom aplikację:
 npx expo start
 3. Zainstaluj Expo Go na telefonie lub użyj emulatora

 Aby zbudować `.apk`:

 1. Zaloguj się do Expo CLI:
 npx expo login

 2. Zbuduj plik:
 npx expo build:android

