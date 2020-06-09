import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Btn = props => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={ {...styles.btn, ...props.btnStyle} }>
                <Text style={{...styles.btnText, ...props.textStyle}}>
                    { props.text }
                </Text>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({

    btn: {
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderColor: 'black',
        borderWidth: 2,
    },
    btnText: {
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 24,
        textAlign: 'center',
    }
})

export default Btn;