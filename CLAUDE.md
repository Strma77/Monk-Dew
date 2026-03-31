# Monk-Dew — Project Reference

## What This App Is
A personal life tracking app built in React Native (Expo). Modular — each life domain is a self-contained feature. Starting with money tracking, will expand to sleep, habits, gym.

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

## Folder Structure
```
src/
  features/
    money/
      MoneyScreen.js
      components/       — UI pieces used only by money feature
      hooks/            — custom hooks for money feature
      utils/            — pure logic, no UI (calculations, calendar, data model)
    sleep/
      SleepScreen.js
    habits/
      HabitsScreen.js
    gym/
      GymScreen.js
  navigation/
    AppNavigator.js     — bottom tab navigator, wires all screens together
  shared/
    theme.js            — design tokens (colors, spacing, fontSize, radius)
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

## Money Screen Design
- Main view: calendar — tap a date to log transactions for that day.
- Form (shown on day tap): amount, category dropdown (hardcoded options + "Other" with free text), note text field.
- Monthly summary: total spent (expenses only — goal is to reduce spending, not budget tracking).
- Future: 0-spend days earn points for a shop/reward system. Keep data model compatible.

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
Date as YYYY-MM-DD string: sortable, comparable, works as object key.
Amount always positive: type field communicates direction.

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

## Current Status

### Done
- Money module complete — calendar, transaction logging, edit/delete, monthly total.
- Export as TXT — shares monthly transactions grouped by day via native share sheet.
- APK built and installed on phone via EAS (production profile, Android APK).
- OTA updates configured — `expo-updates` installed, `app.json` has updates URL + runtimeVersion, `eas.json` production profile has `channel: "production"`. Future JS changes deploy with `eas update --branch production --message "..."`, no reinstall needed.
- Modal fixes: income/expense color in day list, amount shown before category, keyboard avoiding view added.
- Native module rebuild done: `expo-document-picker` + `expo-file-system` installed, APK rebuilt via EAS, import JSON working.
- Bug fix: `getTotalSpent` in `calculations.js` was summing all months — filter now correctly checks month and year from the date string.

### In Progress
- Sleep module (next up — see plan below).
- Future money improvements: layout polish, spending charts, 0-spend points system.

## Sleep Module Plan

### Goal
Manual sleep tracking — input hours/minutes slept each morning, view as a line graph per month.

### Data Model
```js
{ id, date, hours, minutes }
// date = YYYY-MM-DD (wake-up date)
// example: slept 31.3, woke 1.4 → date is 2026-04-01
```

### Screen Layout (top to bottom)
1. Month navigation (same as money)
2. Input — hours + minutes, submit button
3. Line graph — grid + dots + connecting lines

### Graph Design
- Grid background (graph paper style) — vertical lines per day, horizontal lines per hour
- Y-axis: 4h (top) to 10h (bottom) — inverted, less sleep = higher = worse. Fixed range.
- X-axis: days 1–31 of selected month
- Dots per logged day, connected by lines
- Auto-updates on new entry

### Folder Structure
```
src/features/sleep/
  SleepScreen.js
  components/
    SleepInput.js
    SleepGraph.js
  hooks/
    useSleep.js
  utils/
    sleepModel.js
```

### Dependencies
- `react-native-svg` — for drawing the graph (lines, circles, grid)
