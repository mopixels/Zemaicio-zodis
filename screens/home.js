import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import Logo from '../components/logo';
import Card from '../components/card';
import Btn from '../components/btn';
import LanguagePicker from '../components/languagePicker';
import { useSelector } from 'react-redux';

export default function Home({navigation}) {

  const displayLanguage = useSelector( state => state.displayLanguage);
  const language = displayLanguage.language;

  return (
    <ImageBackground source={require('../img/home_backgound.jpg')} style={styles.background} blurRadius={1}>
      <View style={styles.content}> 
        <LanguagePicker />
        <Logo />   
        { language=='lt' ? <Text style={styles.title}> Atsitiktinis žodis: </Text> : <Text style={styles.title}> Atsitiktēnis žuodis: </Text> }
        <Card />
        <View style={styles.navigation}>
          <Btn text={ language=='lt' ? 'Prenumeruok žodį' : 'Prenumerouk žuodi' } btnStyle={styles.button} textStyle={styles.buttonTxt} onPress={() => navigation.navigate('Prenumerata')} />
          <Btn text={ language=='lt' ? 'Žemaitiškas žodynėlis' : 'Žemaitėšks žuodīnielis' } btnStyle={styles.button} textStyle={styles.buttonTxt} onPress={() => navigation.navigate('Žemaitėšks žuodīnielis')} />
          <Btn text={ language=='lt' ? 'Apie' : 'Aple' } btnStyle={styles.button} textStyle={styles.buttonTxt} onPress={() => navigation.navigate('Apie')} />
        </View>
      </View>
    </ImageBackground>
  );
}
  
  const styles = StyleSheet.create({
    background: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingTop:30, 
    },
    title: {
      paddingLeft: 10,
      fontSize: 30,
      fontFamily: 'IMFellDWPica-Italic',
    },
    navigation: {
      padding: 10,  
    },
    button: {
      borderColor: '#5a748d',
      margin: 10,
      borderRadius: 50,
      backgroundColor: '#5a748d',
      opacity: .85,
      elevation: 2,
    },
    buttonTxt: {
      color: '#d9d9d9',
    },
  });