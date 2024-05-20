import { StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { ThemedView } from './ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { CardData } from '@/types';
import { ThemedText } from './ThemedText';

export function Card({ date, pay, isBenefit }: CardData) {
  const colorScheme = useColorScheme();
  const shadowColor = Colors[colorScheme ?? 'light'].icon
  const debtColor = Colors[colorScheme ?? 'light'].debt
  const tintColor = Colors[colorScheme ?? 'light'].tint

  return (
    <ThemedView style={{
      ...styles.card,
      shadowColor,
    }}>
      <ThemedText type="subtitle" lightColor={isBenefit ? debtColor : tintColor} darkColor={isBenefit ? debtColor : tintColor}>{format(date, 'dd.MM.yyyy')}</ThemedText>
      <ThemedText lightColor={isBenefit ? debtColor : tintColor} darkColor={isBenefit ? debtColor : tintColor}>{pay} BYN</ThemedText>
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

