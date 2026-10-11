import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

const TILE = 230;

interface PaperBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Paper base with the bear pattern tiled at 230dp. Each tile is drawn at 10% opacity,
// which matches a 90% paper overlay on top of the full-strength pattern.
export default function PaperBackground({ children, style }: PaperBackgroundProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const cols = Math.ceil(width / TILE);
  const rows = Math.ceil(height / TILE);
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push(
        <Image
          key={`${r}-${c}`}
          source={require('../img/bears_bg.png')}
          style={[styles.tile, { top: r * TILE, left: c * TILE }]}
        />
      );
    }
  }

  return (
    <View style={styles.background}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">{tiles}</View>
      <View style={[styles.content, { paddingTop: insets.top }, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.paper,
    overflow: 'hidden',
  },
  tile: {
    position: 'absolute',
    width: TILE,
    height: TILE,
    opacity: 0.1,
  },
  content: {
    flex: 1,
  },
});
