import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardData } from '@/types';

const KEY = 'key-data';

export const storeData = async (value: CardData[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(KEY, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getData = async (): Promise<null|CardData[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const removeItem = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    console.error('Error removing item:', error);
  }
};
