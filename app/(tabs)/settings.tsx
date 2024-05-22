import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import * as Crypto from 'expo-crypto';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import ModalAddNew from '@/components/ModalAddNew';
import { getData, storeData } from '@/utils/storage';
import { KEY_BENEFITS } from '@/utils/keys-storage';
import { Benefit } from '@/types';
import ClearAllStorage from '@/components/ClearAllStorage';
import { normalizedInput } from '@/utils/normalized';
import { BenefitCard } from '@/components/BenefitCard';

const sumBenefit = 651.35 // 724.85 // '2023-08-01'

export default function TabTwoScreen() {
  const [isShowModalNew, setIsShowModalNew] = useState(false);
  const [sumBenefits, setSumBenefits] = useState<Benefit>({});
  const [isLoading, setIsLoading] = useState(true);

  const colorScheme = useColorScheme();
  const buttonColor = Colors[colorScheme ?? 'light'].button
  const colorTint = Colors[colorScheme ?? 'light'].tint

  const setNewData = (newData: { [x: string]: number }) => {
    setSumBenefits(newData);
    storeData(KEY_BENEFITS, newData);
  }

  const addNewBenefit = (date: Date, number: string) => {
    const newData = {
      ...sumBenefits,
      [format(date, 'yyyy-MM-dd')]: parseFloat(number)
    }
    setNewData(newData);
  }

  const removeBenefit = (startDate: string, sum: number) => {
    const copy = { ...sumBenefits };
    console.log('copy1', JSON.stringify(copy))
    delete copy[startDate];
    console.log('copy2', JSON.stringify(copy))
    setNewData(copy);
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getData(KEY_BENEFITS)
      if (data && !Array.isArray(data)) {
        setSumBenefits(data)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="settings-outline" style={styles.headerImage} />}
      >
        <ThemedView style={styles.titleContainerColumn}>
          <ThemedText type="title" style={styles.startTitle} darkColor={colorTint} lightColor={colorTint}>Loading...</ThemedText>
          <ActivityIndicator size="large" color={colorTint} />
        </ThemedView>
      </ParallaxScrollView>
    )
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="settings-outline" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      {(Object.keys(sumBenefits).length > 0) && (
        <SafeAreaView style={styles.benefits}>
          {Object.entries(sumBenefits).reverse().map(([startDate, sum]) => (
            <BenefitCard
              key={Crypto.randomUUID()}
              startDate={startDate}
              sum={sum}
              onRemoveBenefit={() => removeBenefit(startDate, sum)}
            />
          ))}
        </SafeAreaView>
      )}

      {isShowModalNew
        ? (
          <ModalAddNew
            textBtnDataPicker="Select start date"
            placeholderInput="Select sum benefit, BYN"
            textSum="Selected sum benefit:"
            textBtnClose="Set new benefit"
            onClose={(date, number) => {
              const normalizedNumber = normalizedInput(number)
              setIsShowModalNew(false)
              addNewBenefit(date, normalizedNumber)
            }}
            onHide={() => setIsShowModalNew(false)}
          />
        )
        : (
          <ThemedView style={styles.addButton}>
            <Button title="Add new benefit" color={buttonColor} onPress={() => setIsShowModalNew(true)} />
          </ThemedView>
        )
      }

      <ClearAllStorage />
    </ParallaxScrollView>
  );
}

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
  titleContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  titleContainerBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButton: {
    marginTop: 14,
    cursor: 'pointer',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  modalAdd: {
    borderColor: '#687076',
    borderWidth: 1,
    borderRadius: 12,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 18,
    paddingRight: 18,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  selected: {
    marginTop: 10,
    marginBottom: 10,
  },
  startTitle: {
    marginTop: 25,
    textAlign: 'center',
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
  deleteIcon: {
    color: '#f0ec0c',
    fontSize: 16,
  },
});
