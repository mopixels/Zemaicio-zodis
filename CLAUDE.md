# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Žemaičio žodis: a Samogitian ↔ Lithuanian dictionary app, published on Google Play as `com.mopixels.zemaiciozodis`. It is built with React Native on **Expo SDK 57** (managed workflow, React 19, RN 0.86), with React Navigation v7 and Redux. It targets **Android only** (`app.json` → `platforms: ["android"]`), and the code calls Android-only APIs directly (`ToastAndroid`, `Notifications.setNotificationChannelAsync`).

## Commands

- `npm install`: install dependencies
- `npx tsc --noEmit`: typecheck (strict mode; shared types live in `types.ts`, `RootState` is exported from `App.tsx`)
- `npm start` (`expo start`) starts the dev server; `npm run android` opens it on an Android device or emulator

The repo has no tests, linter or build scripts. Releases are built with EAS / `expo prebuild`. When you release, bump both `expo.version` and `android.versionCode` in `app.json`. `babel.config.js` is gitignored and not needed; Expo falls back to `babel-preset-expo`. Install Expo-managed packages with `npx expo install <pkg>` so versions match the SDK, and run `npx expo-doctor` after dependency changes.

The app was upgraded from SDK 37. The replacements for removed APIs are `expo-splash-screen` (for `AppLoading`), `expo-notifications` (for `Notifications` from `expo` and `expo-permissions`), `@react-native-async-storage/async-storage`, `expo-clipboard` and `useFonts` from `expo-font`. Splash and notification-icon config live under `plugins` in `app.json`.

## Architecture

The UI follows the "Popierius" redesign (heritage paper, serif type, Samogitian red, tiled bear pattern). The original handoff spec is in `design_handoff_redesign_popierius/README.md` if present.

- **`App.tsx`** keeps the splash screen up while it loads the fonts (Cormorant Garamond, Literata and Instrument Sans from `@expo-google-fonts/*`, listed in `theme.ts`) with `useFonts`, creates the Redux store, and defines a bottom tab navigator with no headers: `Word`, `Dictionary` and `Settings` (`RootTabParamList` in `types.ts`). Route names are internal; the visible tab labels and icons live in `components/tabBar.tsx`, a custom tab bar that also hides while the keyboard is open.
- **`theme.ts`** holds the color tokens and font family names. Each font weight is its own family (`fonts.bodyMedium`, `fonts.uiSemiBold`, …), so set `fontFamily` rather than `fontWeight`. Sizes are fixed dp.
- **Screens:**
  - `screens/word.tsx`: random word with Copy, Share and Next buttons.
  - `screens/dictionary.tsx`: search field, direction toggle (flags) and a `FlatList` of results. Tapping a row copies it.
  - `screens/settings.tsx`: UI-language segmented control, the subscription card (`components/timeSelector.tsx`) and the About card (version from `expo-constants`).
  - All screens wrap their content in `components/paperBackground.tsx`, which draws the paper color, the tiled `img/bears_bg.png` at 10% opacity, and the top safe-area inset.
- **Redux** (`constants.ts` → `actions/actions.ts` → `reducers/reducers.ts`) holds three small slices:
  - `searchDictionary.searchField`: the current search text
  - `inputLanguage.isZmt`: whether search matches the Samogitian `title` (true) or the Lithuanian `meaning` (false)
  - `displayLanguage.language`: `'zmt'` or `'lt'`, the UI language chosen in Settings
- **Data:** `assets/data.json` is a flat array of `{ id, title, meaning }`, where `title` is the Samogitian word and `meaning` is the Lithuanian translation. It is bundled and imported directly through `utils.ts` (`words`, `randomWord`); there is no backend.
  - `screens/dictionary.tsx` precomputes accent-stripped keys for both directions (`stripAccents` in `utils.ts`: NFD + strip combining marks + lowercase). Results are substring matches, prefix matches first, then sorted with `localeCompare(…, 'lt')`. A few headwords keep combining marks after NFC, so each entry stores a key→headword index map for highlighting the match.
- **UI text:** strings are not centralized. Each component checks `language == 'lt'` inline and chooses between a Lithuanian and a Samogitian string, so a new user-facing string needs both variants.
- **Daily word subscription:** `notifications.ts` wraps `expo-notifications` (loaded lazily so Expo Go doesn't crash) and schedules a repeating daily local notification (`DAILY` trigger) with a random word. `components/timeSelector.tsx` is the Settings card that controls it; it defaults to 08:00, reschedules when the time changes while on, and stores the time and switch in `AsyncStorage` under the keys `'Notification time'`, `'Display time'` and `'Switch value'`.
- **Feedback:** copying uses `copyToClipboard` in `utils.ts` (clipboard, short vibration, `ToastAndroid`).
