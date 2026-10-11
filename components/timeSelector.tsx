import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import PaperSwitch from './paperSwitch';
import { askNotificationPermission, scheduleDailyWord, cancelNotifications } from '../notifications';
import { colors, fonts } from '../theme';
import type { RootState } from '../App';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const defaultTime = () => {
  const date = new Date();
  date.setHours(8, 0, 0, 0);
  return date;
};

const pad = (n: number) => n.toString().padStart(2, '0');
const formatTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

// The "Prenumerata" card in Settings: daily word notification on/off and its time.
export default function TimeSelector() {

  const [time, setTime] = useState<Date>(defaultTime);
  const [show, setShow] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);

  const language = useSelector((state: RootState) => state.displayLanguage.language);
  const lt = language == 'lt';

  const subscribe = async (date: Date) => {
    await askNotificationPermission();
    await cancelNotifications();
    scheduleDailyWord(date, language);
  };

  // HANDLING DATA AFTER CLOSING DateTimePicker. IF USER PRESSES CANCEL selectedDate IS UNDEFINED
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (event.type !== 'set' || !selectedDate) return;
    setTime(selectedDate);
    _storeTime(selectedDate);
    // CHANGING THE TIME WHILE SUBSCRIBED RESCHEDULES THE NOTIFICATION
    if (switchValue) subscribe(selectedDate);
  };

  const toggleSwitch = (v: boolean) => {
    if (isNaN(time.getTime())) {
      ToastAndroid.show(lt ? 'Prašom pasirinkti laiką' : 'Rēk pasirinkte laika', ToastAndroid.SHORT);
      return;
    }
    setSwitchValue(v);
    _storeSwitchValue(v);
    if (v) {
      _storeTime(time);
      subscribe(time);
      ToastAndroid.show(lt ? 'Prenumerata užsakyta' : 'Prenumerata užsakīta', ToastAndroid.SHORT);
    } else {
      cancelNotifications();
      ToastAndroid.show('Prenumerata išjungta', ToastAndroid.SHORT);
    }
  };

  // STORING USER SELECTED TIME IN DEVICE MEMORY
  const _storeTime = async (date: Date) => {
    try {
      await AsyncStorage.setItem('Notification time', JSON.stringify(date));
      await AsyncStorage.setItem('Display time', JSON.stringify(formatTime(date)));
    } catch (error) {
      console.log(error);
    }
  };

  // STORING SWITCH VALUE IN DEVICE MEMORY
  const _storeSwitchValue = async (v: boolean) => {
    try {
      await AsyncStorage.setItem('Switch value', JSON.stringify(v));
    } catch (error) {
      console.log(error);
    }
  };

  // RETRIEVING DATA FROM LOCAL MEMORY
  const _retrieveData = async () => {
    try {
      const storedNotificationTime = await AsyncStorage.getItem('Notification time');
      const storedSwitchValue = await AsyncStorage.getItem('Switch value');
      if (storedNotificationTime !== null) setTime(new Date(JSON.parse(storedNotificationTime)));
      if (storedSwitchValue !== null) setSwitchValue(JSON.parse(storedSwitchValue) === true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    _retrieveData();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.switchRow}>
        <Text style={styles.rowText}>Prenumerata</Text>
        <PaperSwitch value={switchValue} onValueChange={toggleSwitch} accessibilityLabel="Prenumerata" />
      </View>

      <Text style={styles.description}>
        {lt
          ? 'Aktyvavus prenumeratą kiekvieną dieną siunčiamas pranešimas su žemaitišku žodžiu, bei jo vertimu'
          : 'Aktīvavus prenumerata kuožna dėina gausė pranešėma so žemaitėšku žuodiu ė anuo pargoldīmu'}
      </Text>

      <View style={styles.timeRow}>
        <Text style={styles.rowText}>{lt ? 'Nustatytas laikas' : 'Nustatīts laiks'}</Text>
        <Pressable
          onPress={() => setShow(true)}
          style={({ pressed }) => [styles.timeChip, pressed && styles.timeChipPressed]}
          accessibilityRole="button"
        >
          <Text style={styles.timeText}>{isNaN(time.getTime()) ? '--:--' : formatTime(time)}</Text>
        </Pressable>
      </View>

      {show && (
        <DateTimePicker
          value={isNaN(time.getTime()) ? defaultTime() : time}
          mode="time"
          is24Hour={true}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border14,
    backgroundColor: colors.card,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.ink,
  },
  description: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: colors.muted,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  timeChip: {
    backgroundColor: colors.accentTint08,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  timeChipPressed: {
    backgroundColor: colors.accentTint05,
  },
  timeText: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 16,
    color: colors.accent,
  },
});
