# Monk-Dew — Project Reference

## What This App Is
A personal life tracking app built in React Native (Expo). Modular — each life domain is a self-contained feature. Money, sleep, habits, store, stats.

## Teaching Approach
- The user writes all code himself. Claude explains concepts first, then says what to write and why, then reviews.
- Only show a code example when the user is genuinely stuck — and even then, show a small illustrative piece, not the full solution. Never write whole files or large blocks unprompted.
- Always explain the concept before giving any task. No code before the concept.
- Map JS/React concepts to C/C++/Java equivalents where helpful — the user has solid experience in those languages.
- Never vibe-code. Every line should be understandable and explainable by the user.
- When reviewing code, read the file directly — don't ask the user to paste it.
- When the user is tired or asks for a shortcut, it's okay to give them the specific fix (not the whole file) — but explain it.
- Keep responses concise. Don't over-explain things the user already demonstrated they understand.

## User Background
- Comfortable with C, C++, C#, Java.
- No prior JavaScript, React, or React Native experience.
- Uses VSCode. Runs app via Expo Go / web with `npx expo start --web`.

## Tech Stack
- React Native with Expo (SDK 55, canary — Expo Go on phone has issues with this, use web for now)
- React Navigation v7 — bottom tab navigator
- AsyncStorage — for persisting data to device
- `@expo/vector-icons` (Ionicons) — already included with Expo, no install needed
- `react-native-svg` — for graphs and charts

## Folder Structure
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
      utils/            — sleepModel (createSleepEntry, calcSleepPoints)
    habits/
      HabitsScreen.js
      components/       — GoalItem, GoalSection, HabitsHistory
      hooks/            — useHabits (goals, dailyLog, showTemplateSetup)
      utils/            — habitsModel
    store/
      StoreScreen.js
      components/       — RewardItem, WishlistItem
      hooks/            — useRewards (rewardsLoaded, activeRewards), useStore
      utils/            — rewardsConfig, storeModel
    stats/
      StatsScreen.js    — BitLife-style pillar bars for Sleep/Habits/Money/Points
  navigation/
    AppNavigator.js     — bottom tab navigator (Money, Sleep, Habits, Store, Stats)
  shared/
    theme.js            — design tokens (colors, spacing, fontSize, radius, scale, vScale)
    usePoints.js        — shared points/streaks/penalties hook
    notifications.js    — all scheduled + triggered notifications
```

Feature-based structure: all code for a feature lives together. Shared things go in `shared/`.

## Architecture Decisions
- **Feature-based folders** — not type-based. Adding a new module means adding one folder, not touching 5.
- **`shared/theme.js`** — single source of truth for all visual values. Never hardcode colors or spacing inline.
- **Plain JS objects for data** — no classes. A transaction is just `{ id, date, amount, type, category, note }`.
- **Utils are pure functions** — no React, no JSX. Data in, data out. Easier to reason about and test.
- **`useState` / `useReducer`** — no external state library yet. Learn fundamentals first.

## Design System (theme.js)
- Dark theme. Base background `#232323`.
- Colors: `screenBackground`, `surfaceColor`, `primaryColor` (teal `#00d09f`), `expenseColor`, `incomeColor`, `textPrimary`, `textSecondary`, `borderColor`.
- Spacing and fontSize are scaled using `scale()` from theme — responsive to screen width.
- `scale(size)` and `vScale(size)` are exported from theme.js. Base width 390 (iPhone 14), base height 844.
- Always import `scale`/`vScale` from theme, never redefine them in component files.
- Radius: `sm:6, md:12, lg:20`.
- Never hardcode raw pixel values — use `scale()` or theme tokens.

## Transaction Data Model
```js
{
  id: string,           // Date.now().toString()
  date: string,         // YYYY-MM-DD
  amount: number,       // always positive
  type: 'expense' | 'income',
  category: string,
  note: string
}
```

## Sleep Data Model
```js
{ id, date, hours, minutes }
// date = YYYY-MM-DD (wake-up date)
```
Sleep scoring: bell curve centered at 8h15m (10 pts), tapers to 3 pts at 7h30m or 9h00m, 0 pts outside that range. `calcSleepPoints(hours, minutes)` exported from `sleepModel.js`.

## Habits Data Model
```js
{ id, text, type, completedOn, isTemplate }
// type: 'daily' | 'weekly' | 'monthly'
// completedOn: YYYY-MM-DD of last completion (null if not done this period)
// isTemplate: true for goals set via monthly template modal
```
Daily completion history stored separately in `habitsHistory` AsyncStorage key as `string[]` of YYYY-MM-DD dates (when ALL daily goals were completed).

## Coding Style Rules
- Always `export const` arrow functions — not `export function`.
- Named exports for utilities (`export const fn`), default exports for components (`export default Component`).
- Import paths point to the file, not the folder (`../features/money/MoneyScreen` not `../features/money`).
- Style objects defined in `StyleSheet.create()` at the bottom of the file, never inline except for dynamic values.
- `color`, `fontSize` and other text properties go on `<Text>`, never on `<View>`.
- Use `colors.x` from theme — never hardcode hex values in component files.

## Key Concepts Covered So Far
- `const` vs `let`, arrow functions, objects, destructuring
- `.filter()`, `.reduce()`, `.map()`, `for...of`
- React components, props, JSX syntax rules
- `export default` vs named exports, import paths
- `StyleSheet.create()` — each key is a style object, not individual values
- `View` = box, `Text` = any text (required wrapper), no raw text in JSX
- React Navigation: `NavigationContainer` in App.js, `Tab.Navigator` + `Tab.Screen`, `screenOptions` vs `options`
- `tabBarIcon` — function receiving `{ color, size }`, returns JSX
- `useState` — state inside components, never modify state directly
- `useEffect` with `[]` — runs once on mount, used for loading from AsyncStorage
- `useEffect` with dependency array — re-runs when a value changes (used for modal reset)
- Custom hooks — functions starting with `use`, encapsulate state + logic
- AsyncStorage — `setItem`/`getItem`, always stringify/parse JSON
- `async`/`await` — for async operations like storage reads/writes
- Spread operator `[...array, newItem]` — creating new arrays without mutating
- Spread operator `{...obj, key: newVal}` — updating objects without mutating
- Template literals — backtick strings with `${}` for embedding variables
- Conditional rendering with `&&` and ternary `? :` in JSX
- Style arrays `[styles.base, condition && styles.active]` — merging styles conditionally
- `Modal` component — `visible`, `animationType`, `transparent` props
- `TouchableWithoutFeedback` — tap handler with no visual feedback, used for dismiss-on-backdrop
- `TextInput` — controlled inputs with `value` and `onChangeText`
- `scale()` and `vScale()` — responsive sizing based on screen dimensions
- Ionicons — `name`, `color`, `size` props (color/size are NOT in style)
- `react-native-svg` — `<Svg>`, `<Rect>`, `<Line>`, `<Circle>`, `<Polyline>`, `<Text as SvgText>` for drawing graphs and charts
- SVG coordinate math — map data values to pixel positions using canvas width/height and axis ranges
- `useWindowDimensions` — get screen width/height reactively for responsive SVG sizing
- Module-level constants (e.g. `const TODAY = new Date()`) — stable across re-renders, unlike variables inside components
- `Alert.alert` — native confirmation dialog with action buttons
- `|| 0` fallback — `parseInt('') || 0` safely handles empty numeric inputs
- `Animated` API — `Animated.Value`, `Animated.timing`, `Animated.sequence`, `Animated.delay` for flash banners
- `useRef` for `Animated.Value` — keeps animation value stable across re-renders
- `justifyContent: 'flex-end'` on a fixed-height container — pushes child to bottom (used for pillar fill effect)

## Current Status

### All modules complete and live on device via OTA

**Money** — calendar view, transaction logging (expense/income), edit/delete, monthly total, spending bar chart (per-day bars for current month). Export as TXT, import JSON. MoneyScreen uses ScrollView.

**Sleep** — day stepper input, line graph per month, bell-curve scoring (8h15m = 10 pts), duplicate-safe (overwrite same date, no double points), out-of-range notification, clear data.

**Habits** — daily/weekly/monthly goal sections, checkbox toggle, delete, progress count. Monthly template modal (first open of new month, re-shows if no template goals after skip). 4-week daily completion dot grid (HabitsHistory). Penalty system checked on mount (with rewards-load timing guard).

**Store** — 9 permanent rewards with 2-day cooldown, wishlist with 5-day unlock + 50pt buy. Sections collapsible. Lockout banner on 3+ consecutive misses.

**Points** (`usePoints.js`) — earn via section completion, sleep, 0-spend days. Streak multipliers per section. Penalties for missed periods. Balance threshold notifications. All reward interactions (Iron Will, Streak Shield, Cheat Day, Penalty Erase, Last Stand, Multiplier Freeze, Point Boost, Focus) wired up.

**Stats** — BitLife-style vertical pillar bars for Sleep / Habits / Money / Points. Color-coded: teal ≥66%, amber 33–65%, red <33%. Current month only. Legend explains each metric.

**Notifications** — 10 wired up (3 fixed daily, 1 weekly, 1 monthly, 5 triggered). `expo-notifications` native module — requires EAS build (done).

### Deployment
- APK installed via EAS (production profile). OTA updates via `eas update --branch production --message "..."`.
- `rewardsLoaded` flag in `useRewards` — `checkPenalties` waits for this before running.
- `addSleep` returns bool (new vs overwrite) — `earnSleep` only fires on new entries.
- Template skip no longer saves `habitTemplateMonth` — modal re-appears if no template goals exist.
- `calcSleepPoints` exported from `sleepModel.js` (used by both `usePoints` and `StatsScreen`).
- `dailyLog` in `useHabits` — stored in `habitsHistory` key, populated going forward (no retroactive data).

### No planned features remaining
- Gym module deferred indefinitely.
- Stats screen done.
- Spending chart done.
- Habits history done.
