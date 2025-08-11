import { useSelector } from "react-redux";
import { timerData } from "features/timer/timerSlice";
import useResponsiveFontSize from "features/timer/hooks/useResponsiveFontSize";
import Block from "components/ui/Block";
import Label from "components/ui/Label";
import Input from "components/ui/Input";

function ElectionTimerSettingsFormInput({ label, type, value, onChange }) {
  const fontSize = useResponsiveFontSize();
  const timer = useSelector(timerData);
  return (
    <Block className="p-10">
      <Label className={`mg-r-10 ${fontSize}`} name={label}>
        {label}:
      </Label>{" "}
      <Input
        name={label}
        className={fontSize}
        type={type}
        onChange={onChange}
        value={value}
        disabled={!!(timer.startDate || timer.endDate)}
      ></Input>
    </Block>
  );
}

export default ElectionTimerSettingsFormInput;
