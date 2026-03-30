# Monk Dew

A personal life-tracking mobile app built with React Native and Expo. Designed around the idea that improvement starts with awareness — track your money, sleep, habits, and gym in one place. All data is stored on-device, no backend or account required.

## Status

Active development. Money module is complete and in daily use. Sleep, Habits, and Gym modules are planned.

## Features

### Money Tracker
- Calendar-based daily expense and income logging
- Multiple transactions per day, each stored separately
- Expense/income type toggle per entry
- Category selection with a custom "Other" free-text option
- Visual indicators: dot on days with transactions, teal tint on no-spend days
- Monthly spending total (expenses only — goal is spending reduction, not budgeting)
- Edit and delete existing transactions
- Export month as formatted TXT (share via any app)
- Data persisted locally on device via AsyncStorage

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native (Expo SDK 55) |
| Navigation | React Navigation v7 — bottom tab navigator |
| Local storage | AsyncStorage |
| Icons | @expo/vector-icons (Ionicons) |
| Language | JavaScript (ES2020+) |

## Architecture

Feature-based folder structure — all code for a feature lives together. Adding a new module means adding one self-contained folder, not touching multiple shared directories.

```
src/
  features/
    money/
      MoneyScreen.js
      components/       — UI components scoped to this feature
      hooks/            — useTransactions: state management + AsyncStorage
      utils/            — pure functions: calculations, calendar logic, data model
    sleep/
    habits/
    gym/
  navigation/
    AppNavigator.js     — bottom tab navigator, wires all screens together
  shared/
    theme.js            — single source of truth for colors, spacing, font sizes, radius
```

### Key Decisions

**Feature folders over type folders.** Related code lives together. Scaling one feature doesn't require changes across the whole project.

**No external state library.** Plain `useState` and `useEffect`. Fundamentals are sufficient at this scale and easier to reason about.

**Pure utility functions.** All business logic (`calculations.js`, `calendarUtils.js`) is plain JavaScript with no React or JSX. Data in, data out — easy to reason about and test independently.

**Plain objects for data.** Transactions are plain JS objects, not class instances. Serialize cleanly to and from AsyncStorage JSON.

**Single design token file.** `theme.js` is the only place colors, spacing, and font sizes are defined. Component files never hardcode hex values or raw pixel sizes.

**Responsive scaling.** All sizes go through `scale()` and `vScale()` exported from `theme.js`, using iPhone 14 (390×844) as the baseline. Layout adapts to any screen size.

## Data Model

```js
// Transaction
{
  id: string,        // Date.now().toString()
  date: string,      // YYYY-MM-DD — lexicographically sortable, works as object key
  amount: number,    // always positive — type field communicates direction
  type: string,      // 'expense' | 'income'
  category: string,  // from preset list or user-defined via 'Other'
  note: string
}
```

## Design System

Dark theme. Base background `#232323`. Primary accent teal `#00d09f`.

All visual values are imported from `src/shared/theme.js`. Component files never hardcode colors or pixel values — everything references the design token (e.g. `colors.primaryColor`, `spacing.md`, `fontSize.lg`).

## Running Locally

```bash
npm install
npx expo start --web   # web preview (recommended during development)
npx expo start         # scan QR with Expo Go
```

## Building for Android

To install as a native APK directly on your Android device:

```bash
npm install -g eas-cli
eas build --platform android --profile preview
```

Requires an Expo account. Only needed when installing the real app — for development, web preview is sufficient.

## Notes

- All data is stored locally via AsyncStorage. Uninstalling the app deletes all data.
- The canary SDK version may cause issues with Expo Go — use `--web` for development previewing.

## Roadmap

- [x] Money tracker — calendar, transactions, categories, edit/delete, no-spend highlights, TXT export
- [x] Build preview APK and install on device (EAS Build)
- [ ] Sleep tracker
- [ ] Habits tracker
- [ ] Gym / workout logger
- [ ] Spending charts and trends
- [ ] 0-spend day points and reward system
