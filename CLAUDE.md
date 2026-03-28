# Monk-Dew — Project Reference

## What This App Is
A personal life tracking app built in React Native (Expo). Modular — each life domain is a self-contained feature. Starting with money tracking, will expand to sleep, habits, gym.

## Teaching Approach
- The user writes all code himself. Claude explains concepts first, then says what to write and why, then reviews.
- Only show a code example when the user is genuinely stuck — and even then, show a small illustrative piece, not the full solution.
- Always explain the concept before giving any task.
- Map JS/React concepts to C/C++/Java equivalents where helpful — the user has solid experience in those languages.
- Never vibe-code. Every line should be understandable and explainable by the user.

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
- Spacing: base-4 system — `xs:4, sm:8, md:16, lg:24, xl:32`.
- FontSize: `sm:13, md:15, lg:18, xl:22, xxl:28`.
- Radius: `sm:6, md:12, lg:20`.

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
- `.filter()`, `.reduce()`, `for...of`
- React components, props, JSX syntax rules
- `export default` vs named exports, import paths
- `StyleSheet.create()` — each key is a style object, not individual values
- `View` = box, `Text` = any text (required wrapper), no raw text in JSX
- React Navigation: `NavigationContainer` in App.js, `Tab.Navigator` + `Tab.Screen`, `screenOptions` vs `options`
- `tabBarIcon` — function receiving `{ color, size }`, returns JSX
