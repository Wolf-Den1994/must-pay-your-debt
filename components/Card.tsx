import Ionicons from '@expo/vector-icons/Ionicons';
import { format } from 'date-fns';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CardData } from '@/types';
import AreYouSure from './AreYouSure';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

type CardProps = CardData & {
  onRemoveCard: () => void;
};

const Card = ({ date, pay, isBenefit, onRemoveCard }: CardProps) => {
  const [isShowModal, setIsShowModal] = useState(false);

  const colorScheme = useColorScheme();
  const shadowColor = Colors[colorScheme ?? 'light'].icon;
  const debtColor = Colors[colorScheme ?? 'light'].debt;
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const buttonColor = Colors[colorScheme ?? 'light'].button;
  const secondButtonColor = Colors[colorScheme ?? 'light'].secondButton;

  const formatedDate = format(date, 'dd.MM.yyyy');

  return (
    <ThemedView
      style={{
        ...styles.card,
        shadowColor,
      }}
    >
      {isShowModal ? (
        <AreYouSure
          darkColorText={buttonColor}
          lightColorText={buttonColor}
          typeText="subtitle"
          colorBtnYes={buttonColor}
          colorBtnNo={secondButtonColor}
          textBtnYes="Yes"
          textBtnNo="No"
          onClickYes={onRemoveCard}
          onClickNo={async () => setIsShowModal(false)}
        />
      ) : (
        <>
          <ThemedText
            type="subtitle"
            lightColor={isBenefit ? debtColor : tintColor}
            darkColor={isBenefit ? debtColor : tintColor}
          >
            {formatedDate}
          </ThemedText>
          {!isBenefit && formatedDate !== '01.08.2023' && (
            <Ionicons
              onPress={() => setIsShowModal(true)}
              size={310}
              name="remove-circle-outline"
              style={styles.deleteIcon}
            />
          )}
          <ThemedText lightColor={isBenefit ? debtColor : tintColor} darkColor={isBenefit ? debtColor : tintColor}>
            {pay} BYN
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
  deleteIcon: {
    color: '#f0ec0c',
    fontSize: 22,
  },
});

export default Card;
