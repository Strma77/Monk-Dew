# Monk-Dew

A personal life tracking app built with React Native and Expo. Designed to run locally on your phone with no backend or hosting required — all data is stored on-device.

## What it does

Monk-Dew is a modular self-improvement tracker. Each area of your life lives in its own tab. The app is built so new modules can be added without touching existing code.

### Current modules

**Money** — Track daily spending through a calendar view. Tap a date to log transactions with a category and note. See your total spending for the month at a glance. The focus is on reducing expenses, not budgeting.

**Sleep, Habits, Gym** — Planned modules, currently placeholders.

### Planned features

- 0-spend days earn points in a reward shop
- Sleep tracking with duration and quality logging
- Habit streaks
- Gym session logging

## Tech stack

- React Native with Expo (SDK 55)
- React Navigation v7 — bottom tab navigator
- AsyncStorage — on-device data persistence
- No backend, no account required

## Project structure

```
src/
  features/
    money/
      components/    — UI components (CalendarGrid, DayCell, etc.)
      hooks/         — useTransactions (state + AsyncStorage)
      utils/         — pure logic (calculations, calendar, data model)
    sleep/
    habits/
    gym/
  navigation/
    AppNavigator.js  — bottom tab navigator
  shared/
    theme.js         — design tokens (colors, spacing, typography)
```

## Running the app

You need Node.js and the Expo Go app on your phone, or a development build for full native support.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go to open on your phone. Press `w` to open in a browser for development previewing.

## Building for your phone

To install as a native APK directly on your Android device:

```bash
npx eas build --platform android --profile preview
```

This requires an Expo account and EAS CLI (`npm install -g eas-cli`). You only need to do this when you want to install the real app — for development, Expo Go or the web preview is enough.

## Notes

- All data is stored locally using AsyncStorage. Uninstalling the app deletes all data.
- The canary SDK version may cause issues with Expo Go — use `--web` for previewing during development.
