import React, { useEffect, useState } from 'react';
import { View,  StyleSheet, Text, ImageBackground, Dimensions } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import TimeSelector from '../components/timeSelector';
import data from '../assets/data.json';
import { useSelector } from 'react-redux';

export default function Subcribe() {

  const displayLanguage = useSelector( state => state.displayLanguage );
  const language = displayLanguage.language

  let randomNumber = Math.floor(Math.random() * 304);
  const randomTitle =  data[randomNumber].title 
  const randomMeaning = data[randomNumber].meaning

  const localNotification =  { 
    title: `${ language == 'lt' ? 'Dienos žodis:' : 'Deinos žuodis:' }`,
    body: `${randomTitle} - ${randomMeaning}`,
    android: {
      channelId: 'default',
      sound: true,
      // //icon (optional) (string) — URL of icon to display in notification drawer.
      // //color (optional) (string) — color of the notification icon in notification drawer.
      // priority: 'high', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
      // vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
    }
   };

  // THIS CONST IS ACTIVATED WHEN TIME IS SELECTED IN TimeSelector
  const onSubmit = (time) => {
    const schedulingOptions = {
      time: time,
      repeat: 'day',
    };
    Notifications.scheduleLocalNotificationAsync(
      localNotification,
      schedulingOptions,
    );
  };

  const cancelNotifications = () => {
    Notifications.cancelAllScheduledNotificationsAsync();
  }

  const handleNotification = () => {
    console.log('')
  };

  const askNotification = async () => {
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        priority: 'high',
        vibrate: [0, 250, 250, 250],
      });
    }
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.isDevice && status === 'granted')
      console.log('Notification permissions granted.');
  };

  useEffect(() => {
    askNotification();
    const listener = Notifications.addListener(handleNotification);
    return () => listener.remove();
  }, []);

  return(
    <ImageBackground source={require('../img/screen_background.jpg')} style={styles.background} >
      <View style= {styles.screen}>
        <View style= {styles.content}>
          { language == 'lt' 
          ? <Text style={styles.text}>Aktyvavus prenumeratą kiekvieną dieną siunčiamas pranešimas su žemaitišku žodžiu, bei jo vertimu</Text> 
          : <Text style={styles.text}>Aktīvavus prenumerata kuožna dėina gausė pranešėma so žemaitėšku žuodiu ė anuo pargoldīmu</Text> }
          <TimeSelector style={styles.timeSelector} onSubmit={onSubmit} cancelNotifications={cancelNotifications} />
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
    fontSize: 24,
    fontFamily: 'IMFellDWPica',
  },
});