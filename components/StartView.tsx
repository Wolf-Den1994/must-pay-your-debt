import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import ParallaxScrollView from './ParallaxScrollView';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

type StartViewProps = {
  headerImage: ReactElement;
  headerBackgroundColorLight: string;
  headerBackgroundColorDark: string;
  onClickIcon: () => void;
};

const StartView = ({
  headerImage,
  headerBackgroundColorLight,
  headerBackgroundColorDark,
  onClickIcon,
}: StartViewProps) => {
  const colorScheme = useColorScheme();
  const colorTint = Colors[colorScheme ?? 'light'].tint;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: headerBackgroundColorLight, dark: headerBackgroundColorDark }}
      headerImage={headerImage}
    >
      <ThemedView style={styles.titleContainerColumn}>
        <ThemedText type="title" style={styles.startTitle} darkColor={colorTint} lightColor={colorTint}>
          Benefits should be added first
        </ThemedText>
        <ThemedText type="title" style={styles.startTitle} darkColor={colorTint} lightColor={colorTint}>
          Please, open settings and add
        </ThemedText>
        <Ionicons onPress={onClickIcon} size={310} name="reload" style={styles.startHeaderIcon} />
      </ThemedView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  titleContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startTitle: {
    marginTop: 25,
    textAlign: 'center',
  },
  startHeaderIcon: {
    marginTop: 20,
    color: '#f0ec0c',
    bottom: 10,
    right: 5,
    fontSize: 36,
  },
});

export default StartView;
