import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { searchDictionary, inputLanguage, displayLanguage } from './reducers/reducers';
import Home from './screens/home';
import Subscribe from './screens/subscribe';
import Dictionary from './screens/dictionary';
import About from './screens/about';
import InputSearch from './components/textInput';
import CustomSwitch from './components/customSwitch';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, ImageBackground } from 'react-native';
import type { RootStackParamList } from './types';

SplashScreen.preventAutoHideAsync();

const rootReducers = combineReducers({searchDictionary, inputLanguage, displayLanguage })

export type RootState = ReturnType<typeof rootReducers>;

export default function App() {

  const store = createStore( rootReducers )

  const Stack = createStackNavigator<RootStackParamList>();

  const [fontsLoaded] = useFonts({
    'IMFellDWPica-Italic': require('./assets/fonts/IMFellDWPica-Italic.ttf'),
    'IMFellDWPica': require('./assets/fonts/IMFellDWPica-Regular.ttf'),
    'Merriweather-Regular': require('./assets/fonts/Merriweather-Regular.ttf'),
    'Merriweather-Bold': require('./assets/fonts/Merriweather-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if(!fontsLoaded ) {
    return null;
  } else {
    return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ headerShown : false }}/>
          <Stack.Screen name="Prenumerata" component={Subscribe} options={{ headerTransparent : true }} />
          <Stack.Screen name="Žemaitėšks žuodīnielis" component={Dictionary} options={{ headerBackground: () => (
              <ImageBackground source={require('./img/book.jpg')} style={{ ...StyleSheet.absoluteFill }}/> ), 
              headerTitle: () => <InputSearch />, 
              headerRight: () => <CustomSwitch />, }} />
          <Stack.Screen name="Apie" component={About} options={{ headerBackground: () => (
            <ImageBackground source={require('./img/book.jpg')} style={{ ...StyleSheet.absoluteFill }} /> )}} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )}
}