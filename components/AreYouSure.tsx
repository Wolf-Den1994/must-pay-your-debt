import { Button } from 'react-native';
import { TypeText } from '@/types';
import ThemedText from './ThemedText';

type AreYouSureProps = {
  darkColorText: string;
  lightColorText: string;
  typeText: TypeText;
  colorBtnYes: string;
  colorBtnNo: string;
  textBtnYes: string;
  textBtnNo: string;
  onClickYes: () => void;
  onClickNo: () => void;
}

const AreYouSure = ({
  darkColorText,
  lightColorText,
  typeText,
  colorBtnYes,
  colorBtnNo,
  textBtnYes,
  textBtnNo,
  onClickYes,
  onClickNo
}: AreYouSureProps) => (
    <>
      <ThemedText type={typeText} darkColor={darkColorText} lightColor={lightColorText}>Are you sure?</ThemedText>
      <Button onPress={onClickYes} color={colorBtnYes} title={textBtnYes} />
      <Button onPress={onClickNo} color={colorBtnNo} title={textBtnNo} />
    </>
  );

export default AreYouSure;
