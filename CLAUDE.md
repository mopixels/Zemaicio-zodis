# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Žemaičio žodis: a Samogitian ↔ Lithuanian dictionary app, published on Google Play as `com.mopixels.zemaiciozodis`. It is built with React Native on **Expo SDK 57** (managed workflow, React 19, RN 0.86), with React Navigation v7 and Redux. It targets **Android only** (`app.json` → `platforms: ["android"]`), and the code calls Android-only APIs directly (`ToastAndroid`, `Notifications.setNotificationChannelAsync`).

## Commands

- `npm install`: install dependencies
- `npx tsc --noEmit`: typecheck (strict mode; shared types live in `types.ts`, `RootState` is exported from `App.tsx`)
- `npm start` (`expo start`) starts the dev server; `npm run android` opens it on an Android device or emulator

The repo has no tests, linter or build scripts. Releases are built with EAS / `expo prebuild`. When you release, bump both `expo.version` and `android.versionCode` in `app.json`. `babel.config.js` is gitignored and not needed; Expo falls back to `babel-preset-expo`. Install Expo-managed packages with `npx expo install <pkg>` so versions match the SDK, and run `npx expo-doctor` after dependency changes.

The app was upgraded from SDK 37. The replacements for removed APIs are `expo-splash-screen` (for `AppLoading`), `expo-notifications` (for `Notifications` from `expo` and `expo-permissions`), `@react-native-async-storage/async-storage`, `expo-clipboard`, `@react-native-picker/picker` and `useFonts` from `expo-font`. Splash and notification-icon config live under `plugins` in `app.json`.

## Architecture

- **`App.tsx`** keeps the splash screen up while it loads the custom fonts (IMFellDWPica, Merriweather) with `useFonts`, creates the Redux store, and defines a single stack navigator. **Screen names are the user-facing Lithuanian or Samogitian titles** (`"Prenumerata"`, `"Žemaitėšks žuodīnielis"`, `"Apie"`), and `navigation.navigate(...)` in `screens/home.tsx` uses those strings. If you rename a screen, update both places. The Dictionary screen's header holds the search box (`components/textInput.tsx`) and the input-language toggle (`components/customSwitch.tsx`).
- **Redux** (`constants.ts` → `actions/actions.ts` → `reducers/reducers.ts`) holds three small slices:
  - `searchDictionary.searchField`: the current search text
  - `inputLanguage.isZmt`: whether search matches the Samogitian `title` (true) or the Lithuanian `meaning` (false)
  - `displayLanguage.language`: `'zmt'` or `'lt'`, the UI language chosen in `components/languagePicker.tsx`
- **Data:** `assets/data.json` is a flat array of `{ id, title, meaning }`, where `title` is the Samogitian word and `meaning` is the Lithuanian translation (2818 entries). It is bundled and imported directly; there is no backend.
  - `screens/dictionary.tsx` filters it on every render with the `remove-accents` package and a case-insensitive substring match. In Lithuanian mode it also sorts by `meaning` and swaps the column layout.
  - `components/card.tsx` (the random word on Home) and `screens/subscribe.tsx` (the notification text) pick a random entry with a **hardcoded `2818`**. If you add or remove entries in `data.json`, update that constant or replace it with `data.length`.
- **UI text:** strings are not centralized. Each component checks `language == 'lt'` inline and chooses between a Lithuanian and a Samogitian string, so a new user-facing string needs both variants.
- **Daily word subscription:** `screens/subscribe.tsx` schedules a repeating daily local notification (`Notifications.scheduleNotificationAsync` with a `DAILY` trigger). `components/timeSelector.tsx` stores the chosen time and the on/off switch in `AsyncStorage` under the keys `'Notification time'`, `'Display time'` and `'Switch value'`.
- **Sizing:** `components/actuatedNormalize.ts` scales font sizes and margins by screen height (base 600; it subtracts 2px on Android). Use `actuatedNormalize(n)` for sizes that should be responsive, as the existing styles do.
