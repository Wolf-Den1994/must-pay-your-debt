import Ionicons from '@expo/vector-icons/Ionicons';
import { format, parseISO, isWithinInterval, addMonths, addDays } from 'date-fns';
import * as Crypto from 'expo-crypto';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Image, StyleSheet, SafeAreaView, Button } from 'react-native';
import MainCard from '@/components/Card/MainCard';
import Loading from '@/components/Loading';
import ModalAddNew from '@/components/ModalAddNew';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import StartView from '@/components/StartView';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Benefit, CardData, Interval } from '@/types';
import { sortArrayByDate } from '@/utils/common';
import { CURRENCY } from '@/utils/constants';
import { KEY_DEBTS, KEY_BENEFITS } from '@/utils/keys-storage';
import { normalizeMoney } from '@/utils/normalize';
import { getDataStorage, saveDataStorage } from '@/utils/storage';

const startData = [
  {
    date: format('2023-07-01', 'yyyy-MM-dd'),
    pay: 469.15,
    isBenefit: true,
  },
  {
    date: format('2023-08-01', 'yyyy-MM-dd'),
    pay: 469.15,
  },
];
const startDecree = new Date(2023, 7, 1); // 01 Aug 2023
const currentDate = new Date();

const HomeScreen = () => {
  const [debts, setItems] = useState<CardData[]>([]);
  const [displedDebt, setDispledDebt] = useState<number>(0);
  const [isShowModalNew, setIsShowModalNew] = useState(false);
  const [sumBenefits, setSumBenefits] = useState<Benefit>({});
  const [benifitItems, setBenefitItems] = useState<CardData[]>(startData);
  const [isLoading, setIsLoading] = useState(true);

  const allDebt = useRef(0);

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button;
  const colorHeader = Colors[colorScheme ?? 'light'].headerBackground;

  const calcDebt = (benefits: Benefit, intervals: Interval[]) => {
    let currentDatePointer = startDecree;
    let totalDebt = 0;
    const prevMonthDate = addMonths(currentDate, -1);

    const processInterval = (datePointer: Date, interval: Interval) => {
      if (isWithinInterval(datePointer, interval)) {
        const startDate = interval.start;
        const formatedStartDate = format(startDate, 'yyyy-MM-dd');
        const price = benefits[formatedStartDate];
        setBenefitItems((v) => [
          ...v,
          {
            date: format(datePointer, 'yyyy-MM-dd'),
            pay: price,
            isBenefit: true,
          },
        ]);
        totalDebt += price;
      }
    };

    while (currentDatePointer < prevMonthDate) {
      const datePointer = currentDatePointer;
      intervals.forEach((interval) => processInterval(datePointer, interval));

      currentDatePointer = addMonths(currentDatePointer, 1);
      if (currentDatePointer > prevMonthDate) {
        currentDatePointer = prevMonthDate;
      }
    }

    return totalDebt;
  };

  const setNewData = (newData: CardData[]) => {
    setItems(newData);
    saveDataStorage(KEY_DEBTS, newData);

    calcAllDebt(newData);
  };

  const addNewPay = (date: Date, number: string) => {
    const newData = [...debts, { date: format(date, 'yyyy-MM-dd'), pay: parseFloat(number) }];
    setNewData(newData);
  };

  const removePay = (card: CardData) => {
    const filteredItems = debts.filter((item) => JSON.stringify(item) !== JSON.stringify(card));
    setNewData(filteredItems);
  };

  const getIntervals = (data: object): Interval[] =>
    Object.keys(data).map((startDate, index, array) => ({
      start: parseISO(startDate),
      end: array[index + 1] ? addDays(parseISO(array[index + 1]), -1) : new Date(),
    }));

  const calcAllDebt = (items: CardData[]) => {
    const sumAllPayments = items.reduce((acc, item) => acc + item.pay, 0);
    const newDispledDebt = allDebt.current - sumAllPayments;
    setDispledDebt(newDispledDebt);
  };

  const getItems = (): CardData[] => sortArrayByDate([...benifitItems, ...debts]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setBenefitItems(startData);
      const benefits = await getDataStorage(KEY_BENEFITS);
      if (benefits && !Array.isArray(benefits)) {
        setSumBenefits(benefits);
        const intervals = getIntervals(benefits);

        const totalDebt = calcDebt(benefits, intervals);
        setDispledDebt(totalDebt);
        allDebt.current = totalDebt;

        const debtsData = await getDataStorage(KEY_DEBTS);
        if (debtsData && Array.isArray(debtsData)) {
          setItems(debtsData);
          calcAllDebt(debtsData);
        }
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

  const headerImage = useMemo(
    () => <Image source={require('@/assets/images/coins.png')} style={styles.coinsLogo} />,
    [],
  );

  if (isLoading) {
    return (
      <Loading
        headerImage={headerImage}
        headerBackgroundColorLight={colorHeader}
        headerBackgroundColorDark={colorHeader}
      />
    );
  }

  if (!Object.keys(sumBenefits).length) {
    return (
      <StartView
        headerImage={headerImage}
        headerBackgroundColorLight={colorHeader}
        headerBackgroundColorDark={colorHeader}
        onClickIcon={fetchData}
      />
    );
  }

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: colorHeader, dark: colorHeader }} headerImage={headerImage}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          {displedDebt.toFixed(2)} {CURRENCY}
        </ThemedText>
        <Ionicons onPress={fetchData} size={310} name="reload" style={styles.headerIcon} />
      </ThemedView>

      {isShowModalNew ? (
        <ModalAddNew
          textBtnDataPicker="Select date of receipt"
          placeholderInput={`Select sum pay, ${CURRENCY}`}
          textSum="Selected sum pay:"
          textBtnClose="Set new pay"
          onClose={(date, number) => {
            const normalizedNumber = normalizeMoney(number);
            setIsShowModalNew(false);
            addNewPay(date, normalizedNumber);
          }}
          onHide={() => setIsShowModalNew(false)}
        />
      ) : (
        <ThemedView style={styles.addButton}>
          <Button title="Add new pay" color={colorBtn} onPress={() => setIsShowModalNew(true)} />
        </ThemedView>
      )}

      <SafeAreaView>
        {getItems().map((item) => (
          <MainCard
            key={Crypto.randomUUID()}
            date={item.date}
            pay={item.pay}
            isBenefit={item.isBenefit}
            onRemoveCard={() => removePay(item)}
          />
        ))}
      </SafeAreaView>

      <ThemedView style={styles.startAccout}>
        <ThemedText type="link" numberOfLines={1}>
          (Beginning maternal: {format(startDecree, 'dd.MM.yyyy')})
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
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
});

export default HomeScreen;
