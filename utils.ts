import { Vibration, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import data from './assets/data.json';
import type { Word } from './types';

export const words: Word[] = data;

export const randomWord = (): Word => words[Math.floor(Math.random() * words.length)];

export const wordText = (word: Word) => `${word.title} – ${word.meaning}`;

export const copyToClipboard = (text: string) => {
  Vibration.vibrate(10);
  Clipboard.setStringAsync(text);
  ToastAndroid.show(`Nukopijuota: ${text}`, ToastAndroid.SHORT);
};

// Lowercase and drop diacritics so "zuodis" matches "žuodis".
export const stripAccents = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
