import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Button, FlatList, TextInput, SafeAreaView, RefreshControl, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { RootState } from '@/store';
import { addBenefit } from '@/store/benefitsSlice';

type AndroidMode = 'date' | 'time';

type ModalProps = {
  onClose: (date: Date, num: string) => void;
}

const ModalAddBenefit = ({ onClose }: ModalProps) => {
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [number, onChangeNumber] = useState('');

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button
  const colorText = Colors[colorScheme ?? 'light'].text
  const colorIcon = Colors[colorScheme ?? 'light'].icon

  return (
    <SafeAreaView style={styles.addButton}>
      <Button onPress={() => setShowDatePicker(true)} title="Select start date" />
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          onChange={(event: DateTimePickerEvent, selectedDate: any) => {
            setShowDatePicker(false);
            setDate(selectedDate);
          }}
        />
      )}

      <TextInput
        style={{
          ...styles.input,
          borderColor: colorText,
          color: colorText,
        }}
        placeholderTextColor={colorIcon}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="Select sum benefit, BYN"
        keyboardType="numeric"
      />

      {number && (
        <>
          <ThemedView style={styles.selected}>
            <ThemedText>Selected date: {format(date, 'dd.MM.yyyy')}</ThemedText>
            <ThemedText>Selected sum benefit: {number} BYN</ThemedText>
          </ThemedView>

          <ThemedView style={styles.addButton}>
            <Button title="Set new benefit" color={colorBtn} onPress={() => onClose(date, number)} />
          </ThemedView>
        </>
      )}
    </SafeAreaView>
  )
}

const startDate = new Date(2024, 0, 1) // 01 Jan 2024

export default function TabTwoScreen() {
  // const [sumBenefits, setSumBenefits] = useState<Benefit[]>()
  const [isShowModalNew, setIsShowModalNew] = useState(false)

  const sumBenefits = useSelector((state: RootState) => state.benefits.sumBenefits)
  const dispatch = useDispatch();

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button

  console.log('datadatadata', sumBenefits);

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
          dispatch(addBenefit({
            startDate: format(date, 'yyyy-MM-dd'),
            sum: parseFloat(number)
          }))
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
