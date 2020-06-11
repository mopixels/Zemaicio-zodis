import { Dimensions, Platform, PixelRatio } from 'react-native';

const {
       width: SCREEN_WIDTH,
       height: SCREEN_HEIGHT,
     } = Dimensions.get('window');

    const scale = SCREEN_HEIGHT / 600;

export function actuatedNormalize(size) {
  const newSize = size * scale 
   if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
   } else {
     return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
   }
}