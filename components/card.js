import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import { StyleSheet, TouchableOpacity, Text, Clipboard, Vibration, ToastAndroid } from 'react-native';
import data from '../assets/data.json';

export default function Card() {

    const [ title, setTitle ] = useState('');
    const [ meaning, setMeaning] = useState('');

    // const displayLanguage = useSelector( state => state.displayLanguage );
    // const language = displayLanguage.language
    
    const loadRandomWord = () => { 
        let randomNumber = Math.floor(Math.random() * 2818);
        let randomTitle = data[randomNumber].title;
        let randomMeaning = data[randomNumber].meaning;
        setTitle(randomTitle);
        setMeaning(randomMeaning);
    }

    const writeToClipboard = (text) => {
        Vibration.vibrate(10);
        Clipboard.setString(text);
        ToastAndroid.show(`Nukopijuota: ${text}`, ToastAndroid.SHORT);
    };

    useEffect( () => {
      loadRandomWord();
    }, []);

    return  (
        <TouchableOpacity style={styles.card}  onPress={loadRandomWord}  onLongPress={() =>  writeToClipboard(`${title} - ${meaning}`)}>            
            <Text style={styles.topQuote}> &ldquo; </Text>
            <Text style={styles.title}> {title} - </Text> 
            <Text style={styles.meaning}> {meaning} </Text>
            <Text style={styles.bottomQuote}>&bdquo;</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create ({
    card: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 15,
        margin: 5,
        borderRadius: 30,
        borderWidth: 6,
        backgroundColor: 'rgba(255, 255, 255, .15)',
        borderColor: 'rgba(90, 116, 141, .05)',
    },
    title: {
        fontFamily: 'IMFellDWPica',
        fontSize: 52,
        textAlign: 'center',
        zIndex: 2,
    },
    meaning: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 32,
        fontFamily: 'IMFellDWPica',
        zIndex: 2,
    },
    topQuote: {
        position: 'absolute',
        top: -20,
        left: -28,
        fontFamily: 'IMFellDWPica',
        fontSize: 150,
        color: '#f4f2f2',
        opacity: .3,
        zIndex: 1,
    },
    bottomQuote: {
        position: 'absolute',
        bottom: -15,
        right: 0,
        fontFamily: 'IMFellDWPica',
        fontSize: 150,
        color: '#f4f2f2',
        opacity: .2,
        zIndex: 1
    },
});