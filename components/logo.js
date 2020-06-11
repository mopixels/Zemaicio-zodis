import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

const Logo = () => {
    return  (
    <View style={styles.container}> 
        <Image style={styles.logo} source={require('../img/home_flag.png')} />
    </View>
    )
};

const styles = StyleSheet.create ({
    container: {
        alignSelf: 'center',
        width: '24%',
        height: "13%"
    },
    logo: {
        width: '100%',
        height: "100%"
    }
});

export default Logo;