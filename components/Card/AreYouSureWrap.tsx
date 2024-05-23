import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AreYouSure from '../AreYouSure';

type AreYouSureWrapProps = {
  onClickYes: () => void;
  onClickNo: () => void;
};

const AreYouSureWrap = ({ onClickYes, onClickNo }: AreYouSureWrapProps) => {
  const colorScheme = useColorScheme();
  const buttonColor = Colors[colorScheme ?? 'light'].button;
  const secondButtonColor = Colors[colorScheme ?? 'light'].secondButton;

  return (
    <AreYouSure
      darkColorText={buttonColor}
      lightColorText={buttonColor}
      typeText="subtitle"
      colorBtnYes={buttonColor}
      colorBtnNo={secondButtonColor}
      textBtnYes="Yes"
      textBtnNo="No"
      onClickYes={onClickYes}
      onClickNo={onClickNo}
    />
  );
};

export default AreYouSureWrap;
