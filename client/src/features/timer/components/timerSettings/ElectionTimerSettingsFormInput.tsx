import { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { timerData } from "features/timer/timerSlice";
import useResponsiveFontSize from "features/timer/hooks/useResponsiveFontSize";
import Block from "components/ui/Block";
import Label from "components/ui/Label";
import Input from "components/ui/Input";
import type { BaseInputProps } from "components/ui/BaseInput";

export interface ElectionTimerSettingsFormInputProps {
  label: string;
  type: BaseInputProps["type"];
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function ElectionTimerSettingsFormInput({
  label,
  type,
  value,
  onChange,
}: ElectionTimerSettingsFormInputProps) {
  const fontSize = useResponsiveFontSize();
  const timer = useSelector(timerData);

  const id = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <Block className="p-10p">
      <Label className={`mg-r-10 ${fontSize}`} htmlFor={id} name={label}>
        {label}:
      </Label>{" "}
      <Input
        id={id}
        name={label}
        className={fontSize}
        type={type}
        onChange={onChange}
        value={value}
        disabled={!!(timer.startDate || timer.endDate)}
      />
    </Block>
  );
}

export default ElectionTimerSettingsFormInput;
