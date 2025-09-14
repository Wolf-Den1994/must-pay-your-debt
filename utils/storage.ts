import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardData, Benefit } from '@/types';

export const saveDataStorage = (key: string, value: CardData[] | Benefit): void => {
  try {
    const jsonValue = JSON.stringify(value);
    AsyncStorage.setItem(key, jsonValue).catch(console.error);
  } catch (e) {
    console.error(e);
  }
};

export const getDataStorage = async (key: string): Promise<null | CardData[] | Benefit> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};
