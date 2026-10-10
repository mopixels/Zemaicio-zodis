import React, {useState, useEffect} from 'react';
import {View, Platform, Text, Switch, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Btn from './btn';
import { actuatedNormalize } from './actuatedNormalize';
import { useSelector } from 'react-redux';
import type { RootState } from '../App';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';


interface TimeSelectorProps {
  onSubmit: (time: number | Date) => void;
  cancelNotifications: () => void;
}

export default function TimeSelector(props: TimeSelectorProps) {

  const [date, setDate] = useState<Date>();
  const [show, setShow] = useState(false);
  const [retrievedTime, setRetrievedTime] = useState('');
  const [switchValue, setSwitchValue] = useState(false);

  const displayLanguage = useSelector( (state: RootState) => state.displayLanguage );
  const language = displayLanguage.language

  // HANDLING DATA AFTER CLOSING DateTimePicker
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // DEFINING WHAT HAPPENS WHEN TIME IS CHANGED AND CONFIRMED
    if(selectedDate !== undefined) {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      // CALLING A FUNCTION TO STORE SELECTED TIME
      _storeTime(currentDate);
      setRetrievedTime(currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))

      if (switchValue) {
        props.cancelNotifications();
        toggleSwitch(false)
      }
    // IF USER PRESS CANCEL IN DateTimePicker selectedDate == undefined AND DateTimePicker IS CLOSED
    } else {
      setShow(false)
    }
  }

  const toggleSwitch = (v: boolean) => {
    // ON FIRST VISIT IF THRE'S NO SELECTED TIME, SUBSCRIPTION IS NOT ALLOWED 
    if(retrievedTime == '' || !date) {
      ToastAndroid.show( `${ language=='lt' ? 'Prašom pasirinkti laiką' : 'Rēk pasirinkte laika' }`, ToastAndroid.SHORT);
    } else {
      setSwitchValue(v);
      _storeSwitchValue(v);
      if (v) {
        if(date.getTime() < Date.now()) {
          const dayMore = date.setDate(date.getDate() + 1)
          props.onSubmit(dayMore);
          ToastAndroid.show( `${ language=='lt' ? 'Prenumerata užsakyta' : 'Prenumerata užsakīta' }`, ToastAndroid.SHORT);
        } else {
          props.onSubmit(date);
          ToastAndroid.show( `${ language=='lt' ? 'Prenumerata užsakyta' : 'Prenumerata užsakīta' }`, ToastAndroid.SHORT);
        }
      } else {
        props.cancelNotifications();
        ToastAndroid.show( 'Prenumerata išjungta', ToastAndroid.SHORT);
      }
    }
  }

  // STORING USER SELECTED TIME IN DEVICE MEMORY
  const _storeTime = async(currentDate: Date) => {
    const formatedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    try {
      await AsyncStorage.setItem('Notification time', JSON.stringify(currentDate));
      await AsyncStorage.setItem('Display time', JSON.stringify(formatedTime));
    } catch (error) {
      console.log(error)
    }
  };
  
  // STORING SWITCH VALUE IN DEVICE MEMORY
  const _storeSwitchValue = async(v: boolean) => {
    try {
      await AsyncStorage.setItem('Switch value', JSON.stringify(v));
    } catch (error) {
      console.log(error)
    }
  };

  // RETRIEVING DATA FROM LOCAL MEMORY
  const _retrieveData = async () => {
    try {
      const storedNotificationTime = await AsyncStorage.getItem('Notification time');
      const storedDisplayTime = await AsyncStorage.getItem('Display time');
      const storedSwitchValue = await AsyncStorage.getItem('Switch value');

    if (storedDisplayTime !== null) {
      setRetrievedTime(JSON.parse(storedDisplayTime));
      setSwitchValue(JSON.parse(storedSwitchValue ?? 'null'));
      setDate(new Date(JSON.parse(storedNotificationTime ?? 'null')));
    } } catch (error) {
      console.log(error)
    }
  };

  const showTimepicker = () => {
    setShow(true)
  };

  useEffect( () => {
    _retrieveData();
  }, []);


  return (
    <View >
      <View >
        <View style={styles.container}>

          <View style={styles.switchRow}>
            <Text style={styles.rowText}>Prenumerata</Text>
            <Switch style={styles.switch} value={switchValue} onValueChange={(v) => {toggleSwitch(v)}}/>
          </View>

          <View style={styles.timeRow}>
            { language == 'lt'
            ? <Text style={styles.rowText}>Nustatytas laikas</Text>
            : <Text style={styles.rowText}>Nustatīts laiks</Text> }
              <Text style={styles.time}>{retrievedTime.slice(0, -3)}</Text>
          </View>

        </View>
        <Btn text= { language=='lt' ? 'Pasirinkti laiką' : 'Rinkteis laika' } btnStyle={styles.button} textStyle={styles.buttonTxt} onPress={showTimepicker} />
      </View>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode={'time'}
          is24Hour={true}
          display='spinner'
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 7,
  },
  switchRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#bebebe',
    paddingTop: 30,
    paddingBottom: 7,
    paddingLeft: 10,
  },
  timeRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#bebebe',
    paddingBottom: 7,
    paddingTop: 7,
    paddingLeft: 10,
    paddingRight: 20,
  },
  rowText: {
    fontFamily:'Merriweather-Regular',
    fontSize: actuatedNormalize(18),
  },
  time: {
    fontSize: actuatedNormalize(18),
  },
  switch: {
    transform:[{ scaleX: 2 }, { scaleY: 2 }],
    marginRight: 25,
  },
  button: {
    borderColor: '#5a748d',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 50,
    backgroundColor: '#5a748d',
    opacity: .85,
    elevation: 5,
  },
  buttonTxt: {
    color: '#d9d9d9',
  },
});