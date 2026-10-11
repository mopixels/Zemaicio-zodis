import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { RootState } from '../App';
import type { RootTabParamList } from '../types';

const tabs: Record<keyof RootTabParamList, { icon: React.ComponentProps<typeof Feather>['name']; zmt: string; lt: string }> = {
  Word: { icon: 'message-square', zmt: 'Žuodis', lt: 'Žodis' },
  Dictionary: { icon: 'book', zmt: 'Žuodīnielis', lt: 'Žodynėlis' },
  Settings: { icon: 'sliders', zmt: 'Nustatyma', lt: 'Nustatymai' },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {

  const insets = useSafeAreaInsets();
  const language = useSelector((state: RootState) => state.displayLanguage.language);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // HIDE THE TAB BAR WHILE TYPING SO IT DOESN'T RIDE ON TOP OF THE KEYBOARD
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View style={[styles.bar, { height: 64 + insets.bottom, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = tabs[route.name as keyof RootTabParamList];
        const color = focused ? colors.accent : colors.muted;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
          >
            <Feather name={tab.icon} size={22} color={color} />
            <Text style={[styles.label, { color, fontFamily: focused ? fonts.uiSemiBold : fonts.uiMedium }]}>
              {tab[language]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border15,
    backgroundColor: colors.tabBar,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
  },
});
