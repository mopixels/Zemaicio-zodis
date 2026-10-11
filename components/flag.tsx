import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { colors } from '../theme';
import type { Language } from '../types';

const sources = {
  zmt: require('../img/zmt_flag.png'),
  lt: require('../img/lt_flag.jpg'),
};

export default function Flag({ language }: { language: Language }) {
  return <Image source={sources[language]} style={styles.flag} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  flag: {
    width: 24,
    height: 15,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border15,
  },
});
