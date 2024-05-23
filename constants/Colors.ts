/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#cdb600';
const tintColorDark = '#d8dca1';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    button: '#cdb600',
    secondButton: '#a59c54',
    debt: '#a22',
    headerBackground: '#d8dca1',
    headerBackgroundSecond: '#D0D0D0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    button: '#d7c000',
    secondButton: '#afa959',
    debt: '#c23c3c',
    headerBackground: '#6e6909',
    headerBackgroundSecond: '#353636',
  },
};
