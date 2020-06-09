import React, { useState } from 'react';
import { TouchableWithoutFeedback, TouchableHighlight, StyleSheet, Modal, View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import {Picker} from '@react-native-community/picker';
import { setDisplayLanguage } from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

export default function LanguagePicker() {

  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const displayLanguage = useSelector( state => state.displayLanguage );
  const language = displayLanguage.language;

    return (
      <View>
        <Modal visible={modalVisible} transparent={true} >
          <TouchableHighlight onPress={() => setModalVisible(false)} style={styles.modalOverlay} >
            <View style={styles.modalContent}>
                <TouchableWithoutFeedback >
                  <View style={styles.container}>
                    <Text style={styles.text}>Kalba</Text>
                    <Picker mode={'dropdown'}
                          selectedValue={language}
                          style={styles.picker}
                          onValueChange={(itemValue) =>  dispatch(setDisplayLanguage(itemValue))} >
                        <Picker.Item label="žemaitiu" value="zmt" />
                        <Picker.Item label="lietuvių" value="lt" />
                    </Picker>
                  </View>
                </TouchableWithoutFeedback>
            </View>
          </TouchableHighlight>
        </Modal>

        <TouchableHighlight style={styles.questionIcon}  onPress={() => {setModalVisible(true)}}>
          {/* <FontAwesome name="language" size={36} color="grey" /> */}
          {/* <MaterialIcons name="language" size={36} color="grey" /> */}
          <FontAwesome name="question-circle-o" size={36} color="#888" />
        </TouchableHighlight>
      </View>
    )
}

const styles = StyleSheet.create({
  questionIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 7,
  },
  modalOverlay: {
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    borderRadius: 10,
    marginTop: 50,
    marginHorizontal: 40,
    backgroundColor: 'white'
  },
  container: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    width: '50%',
    textAlign: 'left',
    fontSize: 24,
    padding: 10,
  },
  picker: {
    height: 50,
    width: '50%'
  }
});