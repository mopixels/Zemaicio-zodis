import { Platform } from 'react-native';
import * as Device from 'expo-device';
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

// Schedules a repeating daily notification with a random word at the given time.
export const scheduleDailyWord = (time: Date, language: Language) => {
  const word = randomWord();
  Notifications?.scheduleNotificationAsync({
    content: {
      title: language == 'lt' ? 'Dienos žodis:' : 'Deinos žuodis:',
      body: `${word.title} - ${word.meaning}`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: 'default',
      hour: time.getHours(),
      minute: time.getMinutes(),
    },
  }).catch(e => console.warn(e));
};

export const cancelNotifications = () =>
  Notifications?.cancelAllScheduledNotificationsAsync().catch(e => console.warn(e));
