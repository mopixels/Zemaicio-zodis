import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Linking, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

export default function About() {

  const displayLanguage = useSelector( state => state.displayLanguage);
  const language = displayLanguage.language;
  
      return (
        <ImageBackground source={require('../img/screen_background.jpg')} style={styles.background}> 
          <View style={styles.screen}>

          { language == 'lt' 
          ? <Text style={styles.text}>Pasiūlymus, pastebėtus neatitikimus ir naujus žodžius galite siųsti nurodytais kontaktais</Text> 
          : <Text style={styles.text}>Pasiūlīmus, klaidas ė naujus žuodius gal siōstė nurodytās kontaktās</Text> }

            <View style={styles.row}>
              <Text style={styles.textTitle}>Versija</Text>
              <Text style={styles.text}>1.0.0</Text>
            </View>
            <View style={styles.row}>
              { language == 'lt' 
                ? <Text style={styles.textTitle}>Kontaktai</Text>
                : <Text style={styles.textTitle}>Kontaktā</Text> }
              <TouchableOpacity style={styles.text} onPress={() => Linking.openURL('mailto:dev.mopixels@gmail.com?subject=Žemaičio žodis') }>
                <Text>dev.mopixels@gmail.com</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.text} onPress={() => Linking.openURL('https://github.com/mopixels') }>
                <Text>https://github.com/mopixels</Text>
              </TouchableOpacity>
            </View>
    
          </View>
        </ImageBackground>
      );
    }
  
  const styles = StyleSheet.create({
    background: {
      flex: 1,
    },
    screen: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255, .85)',
      textAlign: 'center',
    },
    row: {
      marginHorizontal: 7,
      marginTop: 15,
      borderBottomWidth: 1,
      borderColor: '#bebebe',
    },
    textTitle:{
      fontSize: 20,
      fontFamily:'Merriweather-Regular',
      paddingHorizontal: 10,
    },
    text: {
      fontSize: 16,
      fontFamily:'Merriweather-Regular',
      paddingTop: 5,
      paddingBottom: 1,
      paddingHorizontal: 10,
    },
  });