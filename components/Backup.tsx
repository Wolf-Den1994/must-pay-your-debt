import { format } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BackupData, Benefit } from '@/types';
import { BACKUP_FILENAME } from '@/utils/constants';
import { KEY_BENEFITS, KEY_DEBTS } from '@/utils/keys-storage';
import { getDataStorage, saveDataStorage } from '@/utils/storage';
import ShouldReload from './ShouldReload';
import ThemedView from './ThemedView';

type BackupProps = {
  sumBenefits: Benefit;
};

const Backup = ({ sumBenefits }: BackupProps) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button;
  const colorSecBtn = Colors[colorScheme ?? 'light'].secondButton;

  const download = async () => {
    try {
      const benefits = await getDataStorage(KEY_BENEFITS);
      const debts = await getDataStorage(KEY_DEBTS);
      if (benefits && !Array.isArray(benefits) && (Array.isArray(debts) || debts === null)) {
        const backupData: BackupData = { benefits, debts };
        const strBackupData = JSON.stringify(backupData);

        const fileUri = `${FileSystem.documentDirectory}${BACKUP_FILENAME}-${format(new Date(), 'yyyy-MM-dd\'T\'HH-mm-ss.SSSxxx')}.txt`;
        await FileSystem.writeAsStringAsync(fileUri, strBackupData, { encoding: FileSystem.EncodingType.UTF8 });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      }
    } catch (err) {
      console.error('Error saving file:', err);
    }
  };

  const writeData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });

      if (result.assets) {
        const [asset] = result.assets;
        const fileContents = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });

        const backupData: BackupData = JSON.parse(fileContents);
        if (backupData.benefits) {
          await saveDataStorage(KEY_BENEFITS, backupData.benefits);
        }
        if (backupData.debts) {
          await saveDataStorage(KEY_DEBTS, backupData.debts);
        }

        setShouldReload(true);
      }
    } catch (err) {
      console.error('Error write data:', err);
    }
  };

  if (shouldReload) {
    return <ShouldReload />;
  }

  return (
    <ThemedView style={styles.addButton}>
      {isShowModal ? (
        <ThemedView style={styles.backup}>
          {Object.keys(sumBenefits).length > 0 && <Button title="Create backup" color={colorBtn} onPress={download} />}
          <Button title="Write data" color={colorSecBtn} onPress={writeData} />
        </ThemedView>
      ) : (
        <Button onPress={() => setIsShowModal(true)} color={colorSecBtn} title="Backup" />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginTop: 14,
    cursor: 'pointer',
  },
  backup: {
    flexDirection: 'column',
    gap: 8,
  },
});

export default Backup;
