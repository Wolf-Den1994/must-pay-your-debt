import type { ReactElement } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type LoadingProps = {
  headerImage: ReactElement;
  headerBackgroundColorLight: string;
  headerBackgroundColorDark: string;
};

const Loading = ({ headerImage, headerBackgroundColorLight, headerBackgroundColorDark }: LoadingProps) => {
  const colorScheme = useColorScheme();
  const colorTint = Colors[colorScheme ?? 'light'].tint;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: headerBackgroundColorLight, dark: headerBackgroundColorDark }}
      headerImage={headerImage}
    >
      <ThemedView style={styles.titleContainerColumn}>
        <ThemedText type="title" style={styles.startTitle} darkColor={colorTint} lightColor={colorTint}>
          Loading...
        </ThemedText>
        <ActivityIndicator size="large" color={colorTint} />
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
});

export default Loading;
