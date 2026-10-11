import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import PaperBackground from '../components/paperBackground';
import { colors, fonts } from '../theme';
import { randomWord, wordText, copyToClipboard } from '../utils';
import type { RootState } from '../App';

const titleSize = (title: string) => {
  const n = title.length;
  return n <= 9 ? 66 : n <= 12 ? 54 : n <= 15 ? 46 : 40;
};

export default function Word() {

  const language = useSelector((state: RootState) => state.displayLanguage.language);
  const lt = language == 'lt';

  const [word, setWord] = useState(randomWord);

  const share = () => {
    Share.share({ message: wordText(word) }).catch(e => console.warn(e));
  };

  return (
    <PaperBackground>
      <View style={styles.header}>
        <Image source={require('../img/home_flag.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>{lt ? 'Žemaičio žodis' : 'Žemaiti žuodis'}</Text>
      </View>

      <View style={styles.wordBlock}>
        <Text style={styles.label}>{lt ? 'Atsitiktinis žodis' : 'Atsitiktēnis žuodis'}</Text>
        <Text
          style={[styles.title, { fontSize: titleSize(word.title) }]}
          textBreakStrategy="balanced"
        >
          {word.title}
        </Text>
        <View style={styles.ornament}>
          <View style={styles.ornamentLine} />
          <View style={styles.ornamentDiamond} />
          <View style={styles.ornamentLine} />
        </View>
        <Text style={styles.meaning} textBreakStrategy="balanced">{word.meaning}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => copyToClipboard(wordText(word))}
          accessibilityRole="button"
          accessibilityLabel={lt ? 'Kopijuoti' : 'Kopijoute'}
          style={({ pressed }) => [styles.circleButton, pressed && styles.pressed]}
        >
          <Feather name="copy" size={22} color={colors.ink} />
        </Pressable>
        <Pressable
          onPress={share}
          accessibilityRole="button"
          style={({ pressed }) => [styles.shareButton, pressed && styles.sharePressed]}
        >
          <Feather name="share" size={20} color={colors.white} />
          <Text style={styles.shareText}>{lt ? 'Dalintis' : 'Dalinteis'}</Text>
        </Pressable>
        <Pressable
          onPress={() => setWord(randomWord())}
          accessibilityRole="button"
          accessibilityLabel={lt ? 'Kitas' : 'Kėts'}
          style={({ pressed }) => [styles.circleButton, pressed && styles.pressed]}
        >
          <Feather name="refresh-cw" size={22} color={colors.ink} />
        </Pressable>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 18,
    paddingHorizontal: 22,
  },
  logo: {
    width: 28,
    height: 34,
  },
  appName: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 12,
    letterSpacing: 12 * 0.14,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  wordBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  label: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 12,
    letterSpacing: 12 * 0.16,
    textTransform: 'uppercase',
    color: colors.accent,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.display,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 22,
  },
  ornament: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 140,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.accent,
  },
  ornamentDiamond: {
    width: 7,
    height: 7,
    backgroundColor: colors.accent,
    transform: [{ rotate: '45deg' }],
  },
  meaning: {
    fontFamily: fonts.bodyItalic,
    fontSize: 26,
    lineHeight: 26 * 1.35,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 30,
  },
  circleButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: colors.accentTint08,
  },
  shareButton: {
    height: 52,
    paddingHorizontal: 26,
    borderRadius: 26,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  sharePressed: {
    opacity: 0.85,
  },
  shareText: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 16,
    color: colors.white,
  },
});
