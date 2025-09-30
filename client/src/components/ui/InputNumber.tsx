import React from "react";
import BaseInput, { BaseInputProps } from "./BaseInput";
import defaultStyle from "./InputText.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface InputNumberProps
  extends Omit<BaseInputProps, "onInput" | "max" | "type"> {
  type?: "number";
  value: string;
  maxLength?: number;
}

/**
 * A component that renders a number input.
 *
 * @returns The rendered input number component.
 */
export default function InputNumber({
  className = "",
  maxLength,
  ...rest
}: InputNumberProps): React.JSX.Element {
  if (maxLength) {
    // compute max value from input length. E.g., if maxLength = 4, max value will be 9999.
    const maxValue = +"".padEnd(maxLength, "9");

    // mutate the rest object to inject max and onInput dynamically
    (rest as BaseInputProps).max = maxValue;
    (rest as BaseInputProps).onInput = (
      e: React.FormEvent<HTMLInputElement>,
    ) => {
      const input = e.target as HTMLInputElement;
      const value = input.value;

      if (value[0] === "0") {
        input.value = "";
      }

      if (+value > maxValue) {
        input.value = "";
      }
    };
  }

  return (
    <BaseInput
      {...rest}
      type="number"
      className={`${defaultStyle["inp-txt"]} ${getCompClasses(
        defaultStyle,
        className,
      )}`}
    />
  );
}
