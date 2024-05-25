import { StyleSheet } from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

const ShouldReload = () => (
  <ThemedView style={styles.reload}>
    <ThemedText type="title" darkColor="#a22" lightColor="#a22">
      NEED RELOAD!
    </ThemedText>
  </ThemedView>
);

const styles = StyleSheet.create({
  reload: {
    marginTop: 14,
    cursor: 'pointer',
  },
});

export default ShouldReload;
