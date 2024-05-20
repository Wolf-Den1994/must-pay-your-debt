import { StyleSheet, Button, TextInput, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { format } from 'date-fns';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type ModalProps = {
  onClose: (date: Date, num: string) => void;
  onHide: () => void;
}

export default function ModalAddPay({ onClose, onHide }: ModalProps) {
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [number, onChangeNumber] = useState('');

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button
  const colorSecBtn = Colors[colorScheme ?? 'light'].secondButton
  const colorText = Colors[colorScheme ?? 'light'].text
  const colorIcon = Colors[colorScheme ?? 'light'].icon

  return (
    <SafeAreaView style={styles.addButton}>
      <Button onPress={() => setShowDatePicker(true)} color={colorBtn} title="Select date of receipt" />
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
        placeholder="Select sum pay, BYN"
        keyboardType="numeric"
      />

      {number && (
        <>
          <ThemedView style={styles.selected}>
            <ThemedText>Selected date: {format(date, 'dd.MM.yyyy')}</ThemedText>
            <ThemedText>Selected sum pay: {number} BYN</ThemedText>
          </ThemedView>

          <ThemedView style={styles.addButton}>
            <Button title="Set new pay" color={colorBtn} onPress={() => onClose(date, number)} />
          </ThemedView>
        </>
      )}

      <ThemedView style={styles.addButton}>
        <Button title="Close" color={colorSecBtn} onPress={onHide} />
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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