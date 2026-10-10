import React, { useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { setSearchField } from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../App';

export default function InputSearch() {

    const dispatch = useDispatch();
    const displayLanguage = useSelector( (state: RootState) => state.displayLanguage);
    const language = displayLanguage.language;

    useEffect(() => {
        dispatch(setSearchField(''))
      }, [] )

    return (
        <View style={styles.container}> 
          <View style={styles.inputContainer}>
            <Fontisto style={styles.iconStyle} name="search" size={16} color="grey" />
            <TextInput placeholderTextColor='#888'
              style={styles.textInput}
              placeholder={ language=='lt' ? 'Paieška' : 'Ėiškuosėna' }
              underlineColorAndroid='transparent'
              onChangeText={(text) => dispatch(setSearchField(text))} />
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'row', 
    alignContent: 'space-between',
    paddingHorizontal: 10,
  },
  inputContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 18,
    color: 'black',
  },
  iconStyle: {
    paddingRight: 5,
  },
})