import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, SafeAreaView, Button, ActivityIndicator } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { format, parseISO, isWithinInterval, addMonths, addDays } from 'date-fns';
import * as Crypto from 'expo-crypto';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getData, storeData } from '@/utils/storage';
import { Benefit, CardData, Interval } from '@/types';
import { Card } from '@/components/Card';
import ModalAddNew from '@/components/ModalAddNew';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { KEY_DEBTS, KEY_BENEFITS } from '@/utils/keys-storage';
import { normalizedInput } from '@/utils/normalized';
import { sortArrayByDate } from '@/utils/common';

const startData = [{
  date: format('2023-07-01', 'yyyy-MM-dd'),
  pay: 469.15,
  isBenefit: true,
}, {
  date: format('2023-08-01', 'yyyy-MM-dd'),
  pay: 469.15,
}]
const startDecree = new Date(2023, 7, 1) // 01 Aug 2023
const currentDate = new Date();

export default function HomeScreen() {
  const [items, setItems] = useState<CardData[]>([]);
  const [displedDebt, setDispledDebt] = useState<number>(0);
  const [isShowModalNew, setIsShowModalNew] = useState(false);
  const [sumBenefits, setSumBenefits] = useState<Benefit>({});
  const [benifitItems, setBenefitItems] = useState<CardData[]>(startData);
  const [isLoading, setIsLoading] = useState(true);

  const allDebt = useRef(0);

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button
  const colorTint = Colors[colorScheme ?? 'light'].tint

  const setNewData = (newData: CardData[]) => {
    setItems(newData);
    storeData(KEY_DEBTS, newData);

    calcAllDebt(newData);
  }

  const addNewPay = (date: Date, number: string) => {
    const newData = [...items, { date: format(date, 'yyyy-MM-dd'), pay: parseFloat(number) }]
    setNewData(newData);
  }

  const getIntervals = (data: object): Interval[] => {
    return Object.keys(data).map((startDate, index, array) => ({
      start: parseISO(startDate),
      end: array[index + 1] ? addDays(parseISO(array[index + 1]), -1) : new Date()
    }));
  }

  const calcDebt = (benefits: Benefit, intervals: Interval[]) => {
    let currentDatePointer = startDecree;
    let totalDebt = 0;
    const prevMonthDate = addMonths(currentDate, -1)
    while (currentDatePointer < prevMonthDate) {
      for (const interval of intervals) {
        if (isWithinInterval(currentDatePointer, interval)) {
          const startDate = interval.start;
          const formatedStartDate = format(startDate, 'yyyy-MM-dd')
          const price = benefits[formatedStartDate]
          setBenefitItems((v) => ([
            ...v,
            {
              date: format(currentDatePointer, 'yyyy-MM-dd'),
              pay: price,
              isBenefit: true,
            }
          ]))
          totalDebt += price
        }
      }

      currentDatePointer = addMonths(currentDatePointer, 1);
      if (currentDatePointer > prevMonthDate) {
        currentDatePointer = prevMonthDate;
      }
    }

    return totalDebt;
  }

  const calcAllDebt = (debts: CardData[]) => {
    const sumAllPayments = debts.reduce((acc, item) => acc + item.pay, 0)
    const newDispledDebt = allDebt.current - sumAllPayments
    setDispledDebt(newDispledDebt)
  }

  const removePay = (card: CardData) => {
    const filteredItems = items.filter((item) => JSON.stringify(item) !== JSON.stringify(card));
    setNewData(filteredItems);
  }

  const getItems = (): CardData[] => {
    return sortArrayByDate([...benifitItems, ...items])
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setBenefitItems(startData);
      const benefits = await getData(KEY_BENEFITS);
      if (benefits && !Array.isArray(benefits)) {
        setSumBenefits(benefits)
        const intervals = getIntervals(benefits)

        const totalDebt = calcDebt(benefits, intervals)
        setDispledDebt(totalDebt);
        allDebt.current = totalDebt;

        const debts = await getData(KEY_DEBTS);
        if (debts && Array.isArray(debts)) {
          setItems(debts);
          calcAllDebt(debts);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  if (isLoading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#d8dca1', dark: '#6e6909' }}
        headerImage={
          <Image
            source={require('@/assets/images/coins.png')}
            style={styles.coinsLogo}
          />
        }>
        <ThemedView style={styles.titleContainerColumn}>
          <ThemedText type="title" style={styles.startTitle} darkColor={colorTint} lightColor={colorTint}>Loading...</ThemedText>
          <ActivityIndicator size="large" color={colorTint} />
        </ThemedView>
      </ParallaxScrollView>
    )
  }

  if (!Object.keys(sumBenefits).length) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#d8dca1', dark: '#6e6909' }}
        headerImage={
          <Image
            source={require('@/assets/images/coins.png')}
            style={styles.coinsLogo}
          />
        }>
        <ThemedView style={styles.titleContainerColumn}>
          <ThemedText type="title" style={styles.startTitle} darkColor={colorTint} lightColor={colorTint}>Benefits should be added first</ThemedText>
          <ThemedText type="title" style={styles.startTitle} darkColor={colorTint} lightColor={colorTint}>Please, open settings and add</ThemedText>
          <Ionicons onPress={() => {
            fetchData();
          }} size={310} name="reload" style={styles.startHeaderIcon} />
        </ThemedView>
      </ParallaxScrollView>
    )
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#d8dca1', dark: '#6e6909' }}
      headerImage={
        <Image
          source={require('@/assets/images/coins.png')}
          style={styles.coinsLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{displedDebt.toFixed(2)} BYN</ThemedText>
        <Ionicons onPress={() => {
          fetchData();
        }} size={310} name="reload" style={styles.headerIcon} />
      </ThemedView>

      {isShowModalNew
        ? (
          <ModalAddNew
            textBtnDataPicker="Select date of receipt"
            placeholderInput="Select sum pay, BYN"
            textSum="Selected sum pay:"
            textBtnClose="Set new pay"
            onClose={(date, number) => {
              const normalizedNumber = normalizedInput(number)
              setIsShowModalNew(false)
              addNewPay(date, normalizedNumber)
            }}
            onHide={() => setIsShowModalNew(false)}
          />
        )
        : (
          <ThemedView style={styles.addButton}>
            <Button title="Add new pay" color={colorBtn} onPress={() => setIsShowModalNew(true)} />
          </ThemedView>
        )
      }

      <SafeAreaView>
        {getItems().map((item) =>
          <Card
            key={Crypto.randomUUID()}
            date={item.date}
            pay={item.pay}
            isBenefit={item.isBenefit}
            onRemoveCard={() => removePay(item)}
          />
        )}
      </SafeAreaView>

      <ThemedView style={styles.startAccout}>
        <ThemedText type="link" numberOfLines={1}>(Beginning maternal: {format(startDecree, 'dd.MM.yyyy')})</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  titleContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  coinsLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  addButton: {
    marginTop: 14,
    cursor: 'pointer',
  },
  startAccout: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerIcon: {
    color: '#f0ec0c',
    bottom: 10,
    right: 5,
    position: 'absolute',
    width: 20,
    height: 20,
    fontSize: 22,
  },
  startHeaderIcon: {
    marginTop: 20,
    color: '#f0ec0c',
    bottom: 10,
    right: 5,
    fontSize: 36,
  },
  startTitle: {
    marginTop: 25,
    textAlign: 'center',
  }
});
