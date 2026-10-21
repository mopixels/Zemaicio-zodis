import { Platform } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomWord } from './utils';
import type { Language } from './types';

// Expo Go doesn't ship a working expo-notifications runtime, so load it lazily and degrade gracefully.
type NotificationsModule = typeof import('expo-notifications');
let Notifications: NotificationsModule | null = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  console.warn('expo-notifications unavailable (Expo Go?):', e);
}

export const askNotificationPermission = async () => {
  if (!Notifications) return;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    const { status } = await Notifications.requestPermissionsAsync();
    if (Device.isDevice && status === 'granted')
      console.log('Notification permissions granted.');
  } catch (e) {
    console.warn('Notification setup failed:', e);
  }
};

const DAYS_AHEAD = 90;

export const scheduleDailyWord = async (time: Date, language: Language) => {
  if (!Notifications) return;
  const now = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    date.setHours(time.getHours(), time.getMinutes(), 0, 0);
    if (date <= now) continue;
    const word = randomWord();
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: language == 'lt' ? 'Dienos žodis:' : 'Deinos žuodis:',
          body: `${word.title} - ${word.meaning}`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          channelId: 'default',
          date,
        },
      });
    } catch (e) {
      console.warn(e);
    }
  }
};

// Re-schedules the upcoming words (if subscribed) so the window never runs out.
export const refreshDailyWords = async (language: Language) => {
  try {
    const on = await AsyncStorage.getItem('Switch value');
    const stored = await AsyncStorage.getItem('Notification time');
    if (!Notifications || on === null || JSON.parse(on) !== true || stored === null) return;
    const time = new Date(JSON.parse(stored));
    if (isNaN(time.getTime())) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    await scheduleDailyWord(time, language);
  } catch (e) {
    console.warn(e);
  }
};

export const cancelNotifications = () =>
  Notifications?.cancelAllScheduledNotificationsAsync().catch(e => console.warn(e));
