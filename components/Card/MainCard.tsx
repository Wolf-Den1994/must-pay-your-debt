import { format } from 'date-fns';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CardData } from '@/types';
import { CURRENCY } from '@/utils/constants';
import ThemedText from '../ThemedText';
import ThemedView from '../ThemedView';
import AreYouSureWrap from './AreYouSureWrap';
import DeleteIcon from './DeleteIcon';

type CardProps = CardData & {
  onRemoveCard: () => void;
};

const Card = ({ date, pay, isBenefit, onRemoveCard }: CardProps) => {
  const [isShowModal, setIsShowModal] = useState(false);

  const colorScheme = useColorScheme();
  const shadowColor = Colors[colorScheme ?? 'light'].icon;
  const debtColor = Colors[colorScheme ?? 'light'].debt;
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  const formatedDate = format(date, 'dd.MM.yyyy');

  return (
    <ThemedView
      style={{
        ...styles.card,
        shadowColor,
      }}
    >
      {isShowModal ? (
        <AreYouSureWrap onClickYes={onRemoveCard} onClickNo={() => setIsShowModal(false)} />
      ) : (
        <>
          <ThemedView style={styles.paidBlock}>
            <ThemedText
              type="subtitle"
              lightColor={isBenefit ? debtColor : tintColor}
              darkColor={isBenefit ? debtColor : tintColor}
              style={styles.date}
            >
              {formatedDate}
            </ThemedText>
            {!isBenefit && formatedDate !== '01.08.2023' && <DeleteIcon onClick={() => setIsShowModal(true)} />}
          </ThemedView>
          <ThemedText lightColor={isBenefit ? debtColor : tintColor} darkColor={isBenefit ? debtColor : tintColor}>
            {pay} {CURRENCY}
          </ThemedText>
        </>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 16,
    marginBottom: 10,
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
    minHeight: 53,
  },
  paidBlock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  date: {
    marginRight: 32,
  }
});

export default Card;
