import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Button, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import ModalAddBenefit from '@/components/ModalAddBenefit';
import { getData, storeData } from '@/utils/storage';
import { KEY_BENEFITS } from '@/utils/keys-storage';
import { Benefit } from '@/types';

export default function TabTwoScreen() {
  const [isShowModalNew, setIsShowModalNew] = useState(false)
  const [sumBenefits, setSumBenefits] = useState<Benefit>({})

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button

  const addNewBenefit = (date: Date, number: string) => {
    const newData = {
      ...sumBenefits,
      [format(date, 'yyyy-MM-dd')]: parseFloat(number)
    }
    setSumBenefits((v) => ({
      ...v,
      ...newData
    }))
    storeData(KEY_BENEFITS, newData)
  }

  const fetchData = async () => {
    const data = await getData(KEY_BENEFITS)
    if (data && !Array.isArray(data)) {
      setSumBenefits(data)
    }
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="settings-outline" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      <SafeAreaView>
        {Object.entries(sumBenefits).map(([startDate, sum]) => (
          <ThemedView style={styles.titleContainer} key={startDate}>
            <ThemedText>
              Since
              <ThemedText type="defaultSemiBold"> {format(startDate, 'dd.MM.yyyy')} </ThemedText>
              - {sum} BYN
            </ThemedText>
          </ThemedView>
        ))}
      </SafeAreaView>

      {isShowModalNew
        ? <ModalAddBenefit onClose={(date, number) => {
          setIsShowModalNew(false)
          addNewBenefit(date, number)
        }} />
        : (
          <ThemedView style={styles.addButton}>
            <Button title="Add new benefit" color={colorBtn} onPress={() => setIsShowModalNew(true)} />
          </ThemedView>
        )
      }
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
  }
});
