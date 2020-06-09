import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

const Logo = () => {
    return  (
    <View> 
        <Image style={styles.logo} source={require('../img/home_flag.png')} />
    </View>
    )
};

const styles = StyleSheet.create ({
    logo: {
        alignSelf: 'center',
        width: 120,
        height: 100
    }
});

export default Logo;