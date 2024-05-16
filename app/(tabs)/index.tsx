import { Image, StyleSheet, SafeAreaView, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { format, parseISO, isWithinInterval, addMonths, addDays } from 'date-fns';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getData, storeData } from '@/utils/storage';
import { Benefit, CardData, Interval } from '@/types';
import { Card } from '@/components/Card';
import ModalAddPay from '@/components/ModalAddPay';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { KEY_DEBTS, KEY_BENEFITS } from '@/utils/keys-storage';

const startDateProject = new Date(2024, 0, 1) // 01 Jan 2024
const currentDate = new Date();

export default function HomeScreen() {
  const [items, setItems] = useState<CardData[]>([]);
  const [allDebt, setAllDebt] = useState<number>(0);
  const [isShowModalNew, setIsShowModalNew] = useState(false)

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button

  const addNewPay = (date: Date, number: string) => {
    const newData = [...items, { date: format(date, 'yyyy-MM-dd'), pay: parseFloat(number) }]
    setItems(newData);
    storeData(KEY_DEBTS, newData);

    calcAllDebt(newData)
  }

  const getIntervals = (data: object): Interval[] => {
    return Object.keys(data).map((startDate, index, array) => ({
      start: parseISO(startDate),
      end: array[index + 1] ? addDays(parseISO(array[index + 1]), -1) : new Date()
    }));
  }

  const calcDebt = (sumBenefits: Benefit, intervals: Interval[]) => {
    let currentDatePointer = startDateProject;
    let totalDebt = 0;
    const prevMonthDate = addMonths(currentDate, -1)
    while (currentDatePointer < prevMonthDate) {
      for (const interval of intervals) {
        if (isWithinInterval(currentDatePointer, interval)) {
          const startDate = interval.start;
          const formatedStartDate = format(startDate, 'yyyy-MM-dd')
          const price = sumBenefits[formatedStartDate]
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
    setAllDebt((v) => v - sumAllPayments)
  }

  const fetchData = async () => {
    try {
      const sumBenefits = await getData(KEY_BENEFITS)
      if (sumBenefits && !Array.isArray(sumBenefits)) {
        const intervals = getIntervals(sumBenefits)

        const totalDebt = calcDebt(sumBenefits, intervals)        
        setAllDebt(totalDebt);

        const debts = await getData(KEY_DEBTS);
        if (debts && Array.isArray(debts)) {
          setItems(debts);
          calcAllDebt(debts)
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

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
        <ThemedText type="title">All debt: {allDebt} BYN</ThemedText>
        <ThemedText type="link">(Start account: {format(startDateProject, 'dd.MM.yyyy')})</ThemedText>
      </ThemedView>

      <SafeAreaView>
        {items.map((item) => <Card key={item.date + item.pay} date={item.date} pay={item.pay} />)}
      </SafeAreaView>

      {isShowModalNew
        ? <ModalAddPay onClose={(date, number) => {
          setIsShowModalNew(false)
          addNewPay(date, number)
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  }
});
