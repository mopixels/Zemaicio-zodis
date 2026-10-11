import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Linking } from 'react-native';
import Constants from 'expo-constants';
import { useDispatch, useSelector } from 'react-redux';
import PaperBackground from '../components/paperBackground';
import TimeSelector from '../components/timeSelector';
import Flag from '../components/flag';
import { setDisplayLanguage } from '../actions/actions';
import { colors, fonts } from '../theme';
import type { RootState } from '../App';
import type { Language } from '../types';

const languages: { value: Language; label: string }[] = [
  { value: 'zmt', label: 'žemaitiu' },
  { value: 'lt', label: 'lietuvių' },
];

export default function Settings() {

  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.displayLanguage.language);
  const lt = language == 'lt';

  return (
    <PaperBackground>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{lt ? 'Nustatymai' : 'Nustatyma'}</Text>

        <View style={[styles.card, styles.languageCard]}>
          <Text style={styles.cardTitle}>Kalba</Text>
          <View style={styles.segmented}>
            {languages.map(({ value, label }) => {
              const selected = language == value;
              return (
                <Pressable
                  key={value}
                  onPress={() => dispatch(setDisplayLanguage(value))}
                  style={[styles.segment, selected && styles.segmentSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Flag language={value} />
                  <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <TimeSelector />

        <View style={[styles.card, styles.aboutCard]}>
          <Text style={styles.cardTitle}>{lt ? 'Apie' : 'Aple'}</Text>
          <Text style={styles.cardText}>
            {lt
              ? 'Pasiūlymus, pastebėtus neatitikimus ir naujus žodžius galite siųsti nurodytais kontaktais'
              : 'Pasiūlīmus, klaidas ė naujus žuodius gal siōstė nurodytās kontaktās'}
          </Text>
          <Pressable onPress={() => Linking.openURL('mailto:dev.mopixels@gmail.com?subject=Žemaičio žodis')}>
            <Text style={styles.link}>dev.mopixels@gmail.com</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL('https://github.com/mopixels')}>
            <Text style={styles.link}>github.com/mopixels</Text>
          </Pressable>
          <Text style={styles.version}>Versija {Constants.expoConfig?.version}</Text>
        </View>
      </ScrollView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
    marginBottom: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border14,
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aboutCard: {
    gap: 10,
  },
  cardTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.ink,
  },
  cardText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: colors.muted,
  },
  segmented: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 10,
    backgroundColor: colors.border07,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  segmentSelected: {
    backgroundColor: colors.card,
  },
  segmentText: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 13,
    color: colors.muted,
  },
  segmentTextSelected: {
    color: colors.accent,
  },
  link: {
    fontFamily: fonts.uiMedium,
    fontSize: 14,
    color: colors.accent,
  },
  version: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.muted,
  },
});
