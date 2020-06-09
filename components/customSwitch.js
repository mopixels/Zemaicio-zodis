import React, { useState, useEffect } from 'react';
import { Animated, TouchableWithoutFeedback, Text, View, StyleSheet, ImageBackground } from 'react-native';
import { setInputLanguage } from '../actions/actions';
import { useDispatch } from 'react-redux';

export default function CustomSwitch() {

    const [backgroundImage, setBackgroundImage] = useState(require('../img/zmt_flag.png'));
    const [toggleValue, setToggleValue] = useState(true);

    const dispatch = useDispatch();

    const moveAnimation = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];

    const _moveBall = () => {
        if (!toggleValue) {            
            Animated.spring(moveAnimation, {
                toValue: { x: 0, y: 0 },
                tension: 20,
            }).start()
            setBackgroundImage(require('../img/lt_flag.jpg'))
            setToggleValue(true)
            dispatch(setInputLanguage(false))
        } else {
            Animated.spring(moveAnimation, {
                toValue: { x: 35, y: 0 },
                tension: 20,
            }).start()
            setBackgroundImage(require('../img/zmt_flag.png'))
            setToggleValue(false)
            dispatch(setInputLanguage(true))
        }
    };

    useEffect( () => {
        setTimeout(() => {
            _moveBall();
          }, 750);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.btnContainer}>
                <ImageBackground
                    source={backgroundImage} 
                    resizeMode='cover'
                    style={{ width: '100%', height: '100%', justifyContent: 'center', borderRadius: 80 }}
                    imageStyle={{ borderRadius: 80 }}>
                    <Animated.View style={[styles.tennisBall, moveAnimation.getLayout()]}>
                        <TouchableWithoutFeedback style={styles.button} onPressIn={_moveBall }>
                            <Text style={StyleSheet.absoluteFill}></Text>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </ImageBackground>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    tennisBall: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 100,
        width: 40,
        height: 40,
        elevation: 3,
        // FOR IOS
        // shadowOffset: { width: 2, height: 3 },
        // shadowColor: '#0E7BD0',
        // shadowOpacity: 1,
    },
    btnContainer: {
        height: 30,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
    }
});