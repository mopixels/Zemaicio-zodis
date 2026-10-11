export const colors = {
  paper: '#f3ede1',
  card: '#fbf8f2',
  tabBar: '#ece4d4',
  ink: '#1f1a17',
  muted: '#6b5f55',
  placeholder: '#8a7f74',
  accent: '#9b2a24',
  switchOff: '#cfc6b8',
  white: '#ffffff',
  rowBg: 'rgba(243,237,225,.6)',
  accentTint05: 'rgba(155,42,36,.05)',
  accentTint08: 'rgba(155,42,36,.08)',
  border07: 'rgba(31,26,23,.07)',
  border09: 'rgba(31,26,23,.09)',
  border10: 'rgba(31,26,23,.1)',
  border12: 'rgba(31,26,23,.12)',
  border14: 'rgba(31,26,23,.14)',
  border15: 'rgba(31,26,23,.15)',
  border20: 'rgba(31,26,23,.2)',
  border25: 'rgba(31,26,23,.25)',
};

// Each weight is a separate font file, so pick the family instead of setting fontWeight.
export const fonts = {
  display: 'CormorantGaramond-SemiBold',
  body: 'Literata-Regular',
  bodyMedium: 'Literata-Medium',
  bodyItalic: 'Literata-Italic',
  ui: 'InstrumentSans-Regular',
  uiMedium: 'InstrumentSans-Medium',
  uiSemiBold: 'InstrumentSans-SemiBold',
};

export const fontAssets = {
  [fonts.display]: require('@expo-google-fonts/cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold.ttf'),
  [fonts.body]: require('@expo-google-fonts/literata/400Regular/Literata_400Regular.ttf'),
  [fonts.bodyMedium]: require('@expo-google-fonts/literata/500Medium/Literata_500Medium.ttf'),
  [fonts.bodyItalic]: require('@expo-google-fonts/literata/400Regular_Italic/Literata_400Regular_Italic.ttf'),
  [fonts.ui]: require('@expo-google-fonts/instrument-sans/400Regular/InstrumentSans_400Regular.ttf'),
  [fonts.uiMedium]: require('@expo-google-fonts/instrument-sans/500Medium/InstrumentSans_500Medium.ttf'),
  [fonts.uiSemiBold]: require('@expo-google-fonts/instrument-sans/600SemiBold/InstrumentSans_600SemiBold.ttf'),
};
