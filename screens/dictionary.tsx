import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Vibration, ToastAndroid, Dimensions, FlatList } from 'react-native';
import allData from '../assets/data.json';
import * as Clipboard from 'expo-clipboard';
import { actuatedNormalize } from '../components/actuatedNormalize';
import { useSelector } from 'react-redux';
import type { RootState } from '../App';
import type { Word } from '../types';
import removeAccents from 'remove-accents';


export default function Dictionary() {

  const [data, setData] = useState<Word[]>([]); 

  const searchField = useSelector( (state: RootState) => state.searchDictionary);
  const searchInput = searchField.searchField.toString().toLowerCase();

  const isZmt = useSelector( (state: RootState) => state.inputLanguage);
  const inputLanguage = isZmt.isZmt;

  //FILTERING DATA STATE (JSON FILE)
  let filteredWord: Word[] = [];
    // CHEKING WHICH LANGUAGE IS SELECTED IN CustomSwitch.js
    if (inputLanguage) { 
      filteredWord = data.filter(word => 
        removeAccents(word.title.toString()).toLowerCase().includes(removeAccents(searchInput))
      );
    } else {
      filteredWord = data.filter(word =>
        removeAccents(word.meaning.toString()).toLowerCase().includes(removeAccents(searchInput))
      );
    }

  const writeToClipboard = (text: string) => {
    Vibration.vibrate(10);
    Clipboard.setStringAsync(text);
    ToastAndroid.show(`Nukopijuota : ${text}`, ToastAndroid.SHORT);
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

  useEffect(() => {
    setData(allData as Word[]);
  }, [] )

  return (
    <ImageBackground source={require('../img/screen_background.jpg')} style={styles.background} > 
      <View style={styles.container}>
        <FlatList
        keyExtractor={(word) => word.id}
        data={ inputLanguage ? filteredWord : filteredWord.sort((a, b) => a.meaning.localeCompare(b.meaning)) }
        renderItem={( {item} ) => (
          <View style={styles.line}>
            <TouchableOpacity  onLongPress={() => writeToClipboard(`${item.title} - ${item.meaning}`)}> 
              { inputLanguage ? 
                <View style={styles.grid}>
                  <Text style={styles.title}>{capitalizeFirstLetter(item.title)}</Text>
                  <Text style={styles.meaning}>{item.meaning}</Text>
                </View>
              : <View style={styles.grid}>
                  <Text style={styles.titleInLt}>{capitalizeFirstLetter(item.meaning)}</Text>
                  <Text style={styles.meaningInLt}>{item.title}</Text>
                </View> }
            </TouchableOpacity>
          </View>
        )} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background : {
    height: Dimensions.get('window').height,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255, .85)',
  },
  line: {
    borderBottomWidth: 1,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  title: {
    flex: 1,
    width: '40%',
    fontSize: actuatedNormalize(18),
    fontFamily: 'Merriweather-Bold',
    paddingVertical: 4,
    paddingLeft: 10,
    paddingRight: 5,
    alignSelf: 'center',
  },
  meaning: {
    width: '60%',
    fontSize: actuatedNormalize(16),
    fontFamily: 'Merriweather-Regular',
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderColor: 'grey',
    alignSelf: 'center'
  }, 
  titleInLt: {
    flex: 1,
    width: '60%',
    fontSize: actuatedNormalize(18),
    fontFamily: 'Merriweather-Bold',
    paddingVertical: 4,
    paddingLeft: 10,
    paddingRight: 5,
    alignSelf: 'center',
  },
  meaningInLt: {
    width: '40%',
    textTransform: 'lowercase',
    fontSize: actuatedNormalize(16),
    fontFamily: 'Merriweather-Regular',
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderColor: 'grey',
    alignSelf: 'center'
  },
});