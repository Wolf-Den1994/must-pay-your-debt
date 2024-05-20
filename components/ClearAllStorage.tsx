import { StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { clear } from '@/utils/storage';

export default function ClearAllStorage() {
  const [isShowModal, setIsShowModal] = useState(false)
  const [shouldReload, setShouldReload] = useState(false)

  const colorScheme = useColorScheme();
  const colorBtn = Colors[colorScheme ?? 'light'].button
  const colorSecBtn = Colors[colorScheme ?? 'light'].secondButton

  const clearAsyncStorage = async () => {
    clear();
    setIsShowModal(false);
    setShouldReload(true);
  }

  if (shouldReload) {
    return (
      <ThemedView style={styles.addButton}>
        <ThemedText type="title" darkColor="#a22" lightColor='#a22'>NEED RELOAD!</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.addButton}>
      {isShowModal
       ? (
        <ThemedView style={styles.clear}>
          <ThemedText type="title" darkColor="#a22" lightColor='#a22'>Are you shure?</ThemedText>
          <Button onPress={clearAsyncStorage} color="#a22" title="YES" />
          <Button onPress={() => setIsShowModal(false)} color={colorBtn} title=">NOOO!<" />
          <ThemedText type="defaultSemiBold">After need reload app!</ThemedText>
        </ThemedView>
       )
       : <Button onPress={() => setIsShowModal(true)} color={colorSecBtn} title="<Clear all storage>" />
      }
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginTop: 14,
    cursor: 'pointer',
  },
  clear: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 3,
    paddingRight: 3,
    gap: 13,
    borderWidth: 1,
    borderColor: '#a22',
    borderRadius: 10
  }
});
