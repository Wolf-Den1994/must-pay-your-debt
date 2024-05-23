import Ionicons from '@expo/vector-icons/Ionicons';
import { format } from 'date-fns';
import * as Crypto from 'expo-crypto';
import { useState, useEffect } from 'react';
import { StyleSheet, Button, SafeAreaView } from 'react-native';
import BenefitCard from '@/components/Card/BenefitCard';
import ClearAllStorage from '@/components/ClearAllStorage';
import Loading from '@/components/Loading';
import ModalAddNew from '@/components/ModalAddNew';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Benefit } from '@/types';
import { CURRENCY } from '@/utils/constants';
import { KEY_BENEFITS } from '@/utils/keys-storage';
import { normalizeMoney } from '@/utils/normalize';
import { getDataStorage, saveDataStorage } from '@/utils/storage';

const TabTwoScreen = () => {
  const [isShowModalNew, setIsShowModalNew] = useState(false);
  const [sumBenefits, setSumBenefits] = useState<Benefit>({});
  const [isLoading, setIsLoading] = useState(true);

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button;
  const colorHeader = Colors[colorScheme ?? 'light'].headerBackgroundSecond;

  const setNewData = (newData: { [x: string]: number }) => {
    setSumBenefits(newData);
    saveDataStorage(KEY_BENEFITS, newData);
  };

  const addNewBenefit = (date: Date, number: string) => {
    const newData = {
      ...sumBenefits,
      [format(date, 'yyyy-MM-dd')]: parseFloat(number),
    };
    setNewData(newData);
  };

  const removeBenefit = (startDate: string) => {
    const copySumBenefits = { ...sumBenefits };
    delete copySumBenefits[startDate];
    setNewData(copySumBenefits);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getDataStorage(KEY_BENEFITS);
      if (data && !Array.isArray(data)) {
        setSumBenefits(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Loading
        headerImage={<Ionicons size={310} name="settings-outline" style={styles.headerImage} />}
        headerBackgroundColorLight={colorHeader}
        headerBackgroundColorDark={colorHeader}
      />
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: colorHeader, dark: colorHeader }}
      headerImage={<Ionicons size={310} name="settings-outline" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      {Object.keys(sumBenefits).length > 0 && (
        <SafeAreaView style={styles.benefits}>
          {Object.entries(sumBenefits)
            .reverse()
            .map(([startDate, sum]) => (
              <BenefitCard
                key={Crypto.randomUUID()}
                startDate={startDate}
                sum={sum}
                onRemoveCard={() => removeBenefit(startDate)}
              />
            ))}
        </SafeAreaView>
      )}

      {isShowModalNew ? (
        <ModalAddNew
          textBtnDataPicker="Select start date"
          placeholderInput={`Select sum benefit, ${CURRENCY}`}
          textSum="Selected sum benefit:"
          textBtnClose="Set new benefit"
          onClose={(date, number) => {
            const normalizedNumber = normalizeMoney(number);
            setIsShowModalNew(false);
            addNewBenefit(date, normalizedNumber);
          }}
          onHide={() => setIsShowModalNew(false)}
        />
      ) : (
        <ThemedView style={styles.addButton}>
          <Button title="Add new benefit" color={colorBtn} onPress={() => setIsShowModalNew(true)} />
        </ThemedView>
      )}

      <ClearAllStorage />
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    marginTop: 14,
    cursor: 'pointer',
  },
  selected: {
    marginTop: 10,
    marginBottom: 10,
  },
  benefits: {
    borderColor: '#687076',
    borderWidth: 1,
    borderRadius: 12,
    paddingBottom: 10,
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});

export default TabTwoScreen;
