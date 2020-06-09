import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';
import { Fontisto } from '@expo/vector-icons';
import { setSearchField } from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

export default function InputSearch() {

    const dispatch = useDispatch();
    const displayLanguage = useSelector( state => state.displayLanguage);
    const language = displayLanguage.language;

    useEffect(() => {
        dispatch(setSearchField(''))
      }, [] )

    return (
        <View style={styles.container}> 
        <Input placeholderTextColor='#888'
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.textInput}
            placeholder={ language=='lt' ? 'Paieška' : 'Ėiškuosėna' }
            underlineColorAndroid='transparent'
            onChangeText={(text) => dispatch(setSearchField(text))}
            leftIcon={<Fontisto style={styles.iconStyle} name="search" size={16} color="grey" />} />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row', 
        alignContent: 'space-between'
    },
    inputContainer: {
        flex:1,
        height: 40,
        width: '120%',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, .8)',
        borderBottomWidth: 0, 
        marginTop: 25,
        marginLeft: -35,
        paddingHorizontal: 15,
    },
      textInput: {
        flex: 1,
        width: 160,
    },
    
      iconStyle: {
        paddingRight: 5,
      },
})