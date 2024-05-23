import { format } from 'date-fns';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CURRENCY } from '@/utils/constants';
import ThemedText from '../ThemedText';
import ThemedView from '../ThemedView';
import AreYouSureWrap from './AreYouSureWrap';
import DeleteIcon from './DeleteIcon';

type BenefitProps = {
  startDate: string;
  sum: number;
  onRemoveCard: () => void;
};

const BenefitCard = ({ startDate, sum, onRemoveCard }: BenefitProps) => {
  const [isShowModal, setIsShowModal] = useState(false);

  return isShowModal ? (
    <ThemedView style={styles.titleContainerBenefit}>
      <AreYouSureWrap onClickYes={onRemoveCard} onClickNo={() => setIsShowModal(false)} />
    </ThemedView>
  ) : (
    <ThemedView style={styles.titleContainerBenefit}>
      <ThemedText style={styles.text}>
        Since
        <ThemedText type="defaultSemiBold"> {format(startDate, 'dd.MM.yyyy')} </ThemedText>- {sum} {CURRENCY}
      </ThemedText>
      <DeleteIcon onClick={() => setIsShowModal(true)} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  titleContainerBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 36,
  },
  text: {
    fontSize: 18,
  },
});

export default BenefitCard;
