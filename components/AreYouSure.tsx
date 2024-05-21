import { Button } from "react-native"
import { ThemedText } from "./ThemedText"
import { TypeText } from "@/types";

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

export default function AreYouSure({
  darkColorText,
  lightColorText,
  typeText,
  colorBtnYes,
  colorBtnNo,
  textBtnYes,
  textBtnNo,
  onClickYes,
  onClickNo
}: AreYouSureProps) {
  return (
    <>
      <ThemedText type={typeText} darkColor={darkColorText} lightColor={lightColorText}>Are you sure?</ThemedText>
      <Button onPress={onClickYes} color={colorBtnYes} title={textBtnYes} />
      <Button onPress={onClickNo} color={colorBtnNo} title={textBtnNo} />
    </>
  )
}