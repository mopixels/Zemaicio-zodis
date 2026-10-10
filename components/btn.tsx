import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { actuatedNormalize } from './actuatedNormalize';

interface BtnProps {
    text: string;
    onPress: () => void;
    btnStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Btn = (props: BtnProps) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={ [styles.btn, props.btnStyle] }>
                <Text style={ [styles.btnText, props.textStyle] }>
                    { props.text }
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        borderRadius: 20,
        paddingVertical: actuatedNormalize(12),
        paddingHorizontal: 10,
        borderColor: 'black',
        borderWidth: 2,
    },
    btnText: {
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: actuatedNormalize(22),
        textAlign: 'center',
    }
})

export default Btn;