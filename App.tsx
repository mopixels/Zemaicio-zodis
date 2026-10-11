import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { searchDictionary, inputLanguage, displayLanguage } from './reducers/reducers';
import Word from './screens/word';
import Dictionary from './screens/dictionary';
import Settings from './screens/settings';
import TabBar from './components/tabBar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { colors, fontAssets } from './theme';
import type { RootTabParamList } from './types';

SplashScreen.preventAutoHideAsync();

const rootReducers = combineReducers({searchDictionary, inputLanguage, displayLanguage })

export type RootState = ReturnType<typeof rootReducers>;

const store = createStore( rootReducers )

const Tab = createBottomTabNavigator<RootTabParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.paper },
};

export default function App() {

  const [fontsLoaded] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if(!fontsLoaded ) {
    return null;
  } else {
    return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer theme={navigationTheme}>
          <Tab.Navigator tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Word" component={Word} />
            <Tab.Screen name="Dictionary" component={Dictionary} />
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )}
}
