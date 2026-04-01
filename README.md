# Monk Dew

A personal life-tracking mobile app built with React Native and Expo. Designed around the idea that improvement starts with awareness — track your money, sleep, habits, and points in one place. All data is stored on-device, no backend or account required.

## Status

All modules complete and deployed. Running on-device via EAS production APK with OTA updates.

## Features

### Money Tracker
- Calendar-based daily expense and income logging
- Multiple transactions per day, each stored separately
- Expense/income type toggle per entry
- Category selection with a custom "Other" free-text option
- Visual indicators: dot on days with transactions, teal tint on no-spend days
- Monthly spending total (expenses only)
- Spending bar chart — per-day bars for current month
- Edit and delete existing transactions
- Export month as formatted TXT, import via JSON
- Data persisted locally on device via AsyncStorage

### Sleep Tracker
- Day stepper input (hours + minutes)
- Line graph showing sleep per day for the current month
- Bell-curve scoring centered at 8h15m (max 10 pts), tapers to 0 outside 7h30m–9h00m
- Duplicate-safe: logging the same date overwrites, no double points
- Out-of-range notification when sleep is logged outside scoring window
- Clear all data option

### Habits Tracker
- Daily, weekly, and monthly goal sections
- Checkbox toggle and delete per goal
- Progress count per section
- Monthly template modal — appears on first open of a new month, re-appears if no template goals exist
- 4-week daily completion dot grid (HabitsHistory)
- Penalty system checked on mount

### Store
- 9 permanent rewards with 2-day cooldown
- Wishlist with 5-day unlock + 50pt buy
- Collapsible sections
- 24h lockout banner on 3+ consecutive missed periods

### Points
- Earn: complete a full habit section, log sleep (+5 flat), 0-spend days (+15 each, scanned retroactively)
- Streak multipliers per section (daily +0.1x/day, weekly +0.25x/week, monthly +0.5x/month, spend +0.1x/day), each active 2 days, stack additively
- Penalties: -5/-15/-30 pts for daily/weekly/monthly misses; 3 consecutive misses → 24h store lockout
- All reward interactions wired up (Iron Will, Streak Shield, Cheat Day, Penalty Erase, Last Stand, Multiplier Freeze, Point Boost, Focus)

### Stats
- BitLife-style vertical pillar bars for Sleep / Habits / Money / Points
- Color-coded: teal ≥66%, amber 33–65%, red <33%
- Current month only, with legend explaining each metric

### Notifications
- 10 total: 3 fixed daily, 1 weekly, 1 monthly, 5 triggered
- Requires native build (expo-notifications)

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native (Expo SDK 55) |
| Navigation | React Navigation v7 — bottom tab navigator |
| Local storage | AsyncStorage |
| Icons | @expo/vector-icons (Ionicons) |
| Charts | react-native-svg |
| Notifications | expo-notifications |
| Language | JavaScript (ES2020+) |

## Architecture

Feature-based folder structure — all code for a feature lives together. Adding a new module means adding one self-contained folder, not touching multiple shared directories.

```
src/
  features/
    money/
      MoneyScreen.js
      components/       — CalendarGrid, CalendarHeader, DayCell, MonthlyTotal, SpendingChart, TransactionModal
      hooks/            — useTransactions
      utils/            — calculations, calendarUtils, exportTransactions, transactionModel
    sleep/
      SleepScreen.js
      components/       — SleepGraph, SleepInput
      hooks/            — useSleep
      utils/            — sleepModel
    habits/
      HabitsScreen.js
      components/       — GoalItem, GoalSection, HabitsHistory
      hooks/            — useHabits
      utils/            — habitsModel
    store/
      StoreScreen.js
      components/       — RewardItem, WishlistItem
      hooks/            — useRewards, useStore
      utils/            — rewardsConfig, storeModel
    stats/
      StatsScreen.js
  navigation/
    AppNavigator.js     — bottom tab navigator
  shared/
    theme.js            — design tokens (colors, spacing, fontSize, radius, scale, vScale)
    usePoints.js        — shared points/streaks/penalties hook
    notifications.js    — all scheduled + triggered notifications
```

### Key Decisions

**Feature folders over type folders.** Related code lives together. Scaling one feature doesn't require changes across the whole project.

**No external state library.** Plain `useState` and `useEffect`. Fundamentals are sufficient at this scale and easier to reason about.

**Pure utility functions.** All business logic is plain JavaScript with no React or JSX. Data in, data out.

**Plain objects for data.** All data models are plain JS objects — serialize cleanly to and from AsyncStorage JSON.

**Single design token file.** `theme.js` is the only place colors, spacing, and font sizes are defined. Component files never hardcode hex values or raw pixel sizes.

**Responsive scaling.** All sizes go through `scale()` and `vScale()` exported from `theme.js`, using iPhone 14 (390×844) as the baseline.

## Data Models

```js
// Transaction
{ id, date, amount, type, category, note }
// type: 'expense' | 'income' — amount always positive

// Sleep entry
{ id, date, hours, minutes }
// date = YYYY-MM-DD (wake-up date)

// Habit goal
{ id, text, type, completedOn, isTemplate }
// type: 'daily' | 'weekly' | 'monthly'
// completedOn: YYYY-MM-DD of last completion, null if not done this period
```

## Design System

Dark theme. Base background `#232323`. Primary accent teal `#00d09f`.

All visual values imported from `src/shared/theme.js`. Component files never hardcode colors or pixel values.

## Running Locally

```bash
npm install
npx expo start --web   # web preview (recommended during development)
npx expo start         # scan QR with Expo Go
```

## Deploying Updates

**JS-only changes (no reinstall needed):**
```bash
eas update --branch production --message "what changed"
```
The installed app checks for updates on launch and applies them automatically.

**Native changes** (new packages with native modules, android/ios config changes):
```bash
eas build --platform android --profile production
```
Download and install the new APK.

## Notes

- All data is stored locally via AsyncStorage. Uninstalling the app deletes all data.
- OTA updates via `expo-updates` — app checks for updates on each launch.
- The canary SDK version may cause issues with Expo Go — use `--web` for development previewing.

## Roadmap

- [x] Money tracker — calendar, transactions, categories, edit/delete, no-spend highlights, TXT export, JSON import, spending chart
- [x] Sleep tracker — input, graph, bell-curve scoring, notifications
- [x] Habits tracker — daily/weekly/monthly goals, template modal, history dot grid, penalty system
- [x] Store — permanent rewards, wishlist, cooldowns, lockout
- [x] Points system — earn, streaks, multipliers, penalties, reward interactions
- [x] Stats screen — BitLife-style pillar bars for all modules
- [x] Notifications — 10 wired up (fixed + triggered)
- [x] EAS Build — production APK installed on device
- [x] OTA updates — JS changes deploy without reinstall
