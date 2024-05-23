import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureResponderEvent, StyleSheet } from 'react-native';

type DeleteIconProps = {
  onClick: (event: GestureResponderEvent) => void;
};

const DeleteIcon = ({ onClick }: DeleteIconProps) => (
  <Ionicons onPress={onClick} size={310} name="remove-circle-outline" style={styles.deleteIcon} />
);

const styles = StyleSheet.create({
  deleteIcon: {
    color: '#f0ec0c',
    fontSize: 22,
  },
});

export default DeleteIcon;
