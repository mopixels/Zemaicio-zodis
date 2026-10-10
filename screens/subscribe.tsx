import React, { useEffect } from 'react';
import { View,  StyleSheet, Text, ImageBackground, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import TimeSelector from '../components/timeSelector';
import { actuatedNormalize } from '../components/actuatedNormalize';
import data from '../assets/data.json';
import { useSelector } from 'react-redux';
import type { RootState } from '../App';
import type { Word } from '../types';

const words: Word[] = data;

export default function Subcribe() {

  const displayLanguage = useSelector( (state: RootState) => state.displayLanguage );
  const language = displayLanguage.language

  let randomNumber = Math.floor(Math.random() * 2818);
  const randomTitle =  words[randomNumber].title 
  const randomMeaning = words[randomNumber].meaning

  const localNotification =  { 
    title: `${ language == 'lt' ? 'Dienos žodis:' : 'Deinos žuodis:' }`,
    body: `${randomTitle} - ${randomMeaning}`,
    sound: true,
   };

  // THIS CONST IS ACTIVATED WHEN TIME IS SELECTED IN TimeSelector
  const onSubmit = (time: number | Date) => {
    const date = new Date(time);
    Notifications.scheduleNotificationAsync({
      content: localNotification,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: 'default',
        hour: date.getHours(),
        minute: date.getMinutes(),
      },
    });
  };

  const cancelNotifications = () => {
    Notifications.cancelAllScheduledNotificationsAsync();
  }

  const askNotification = async () => {
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
  };

  useEffect(() => {
    askNotification();
  }, []);

  return(
    <ImageBackground source={require('../img/screen_background.jpg')} style={styles.background} >
      <View style= {styles.screen}>
        <View style= {styles.content}>
          { language == 'lt' 
          ? <Text style={styles.text}>Aktyvavus prenumeratą kiekvieną dieną siunčiamas pranešimas su žemaitišku žodžiu, bei jo vertimu</Text> 
          : <Text style={styles.text}>Aktīvavus prenumerata kuožna dėina gausė pranešėma so žemaitėšku žuodiu ė anuo pargoldīmu</Text> }
          <TimeSelector onSubmit={onSubmit} cancelNotifications={cancelNotifications} />
        </View>
      </View>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,.75)',
  },
  content: {
    flex: 1,
    marginTop: 80,
  },
  text: {
    marginHorizontal: 10,
    marginTop: 10,
    textAlign: 'justify',
    fontSize: actuatedNormalize(22),
    fontFamily: 'IMFellDWPica',
  },
});