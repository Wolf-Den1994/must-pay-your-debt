import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { format } from 'date-fns';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import AreYouSure from '@/components/AreYouSure';

type BenefitProps = {
  startDate: string;
  sum: number;
  onRemoveBenefit: () => void;
}

export function BenefitCard({ startDate, sum, onRemoveBenefit }: BenefitProps) {
  const [isShowModalDelete, setIsShowModalNewDelete] = useState(false);

  const colorScheme = useColorScheme();
  const buttonColor = Colors[colorScheme ?? 'light'].button
  const secondButtonColor = Colors[colorScheme ?? 'light'].secondButton

  return (
    isShowModalDelete
      ? (
        <ThemedView style={styles.titleContainerBenefit}>
          <AreYouSure
            darkColorText={buttonColor}
            lightColorText={buttonColor}
            typeText="subtitle"
            colorBtnYes={buttonColor}
            colorBtnNo={secondButtonColor}
            textBtnYes="Yes"
            textBtnNo="No"
            onClickYes={onRemoveBenefit}
            onClickNo={async () => setIsShowModalNewDelete(false)}
          />
        </ThemedView>
      )
      : (
        <ThemedView style={styles.titleContainerBenefit}>
          <ThemedText style={styles.text}>
            Since
            <ThemedText type="defaultSemiBold"> {format(startDate, 'dd.MM.yyyy')} </ThemedText>
            - {sum} BYN
          </ThemedText>
          <Ionicons
            onPress={() => setIsShowModalNewDelete(true)}
            size={310}
            name="remove-circle-outline"
            style={styles.deleteIcon}
          />
        </ThemedView>
      )
  )
}

const styles = StyleSheet.create({
  titleContainerBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 36,
  },
  deleteIcon: {
    color: '#f0ec0c',
    fontSize: 16,
  },
  text: {
    fontSize: 18,
  }
});