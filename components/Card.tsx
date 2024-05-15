import { StyleSheet } from 'react-native';

import { ThemedView } from './ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { CardData } from '@/types';
import { ThemedText } from './ThemedText';

export function Card({ date, pay }: CardData) {
  const colorScheme = useColorScheme();
  const shadowColor = Colors[colorScheme ?? 'light'].icon

  return (
    <ThemedView style={{
      ...styles.card,
      shadowColor,
    }}>
      <ThemedText type="subtitle">{date}</ThemedText>
      <ThemedText>{pay} BYN</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    marginBottom: 16,
    borderColor: '#687076',
    borderWidth: 1,
    borderRadius: 12,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 18,
    paddingRight: 18,
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

