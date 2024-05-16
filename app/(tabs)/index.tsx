import { Image, StyleSheet, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getData, storeData } from '@/utils/storage';
import { CardData } from '@/types';
import { Card } from '@/components/Card';
import { RootState } from '@/store';

export default function HomeScreen() {
  const [items, setItems] = useState<CardData[]>([]);
  const [allDebt, setAllDebt] = useState<number>(0);

  const sumBenefits = useSelector((state: RootState) => state.benefits.sumBenefits)

  const fetchData = async () => {
    try {
      const data = await getData();
      console.log('data', data)
      if (data) {
        setItems(data);
        const sumAllPayments = data.reduce((acc, { date, pay }) => {
          return acc + pay
        }, 0)
        setAllDebt(sumAllPayments)
      } else {
        const x = [{
          date: '15.05.2024',
          pay: 145
        }, {
          date: '16.05.2024',
          pay: 56
        }]
        storeData(x)
        setItems(x)
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  console.log('itemsitemsitems', items);

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
      </ThemedView>

      <SafeAreaView>
        {items.map((item) => <Card key={item.date} date={item.date} pay={item.pay} />)}
      </SafeAreaView>

      <ThemedText type="defaultSemiBold">Add pay</ThemedText>
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
});
