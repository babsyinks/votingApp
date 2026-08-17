import React from "react";

import { BaseInputProps } from "./BaseInput";
import InputDate, { InputDateProps } from "./InputDate";
import InputFile, { InputFileProps } from "./InputFile";
import InputNumber, { InputNumberProps } from "./InputNumber";
import InputText, { InputTextProps } from "./InputText";
import InputTime, { InputTimeProps } from "./InputTime";

interface InputTypeMap {
  text: InputTextProps;
  password: InputTextProps;
  email: InputTextProps;
  file: InputFileProps;
  date: InputDateProps;
  time: InputTimeProps;
  number: InputNumberProps;
}

const componentMap: {
  [K in keyof InputTypeMap]: React.ComponentType<InputTypeMap[K]>;
} = {
  file: InputFile,
  date: InputDate,
  time: InputTime,
  number: InputNumber,
  text: InputText,
  password: InputText,
  email: InputText,
};

/**
 * Renders the correct input component based on the `type` prop.
 */
export default function Input<T extends BaseInputProps["type"]>(
  props: BaseInputProps & { type: T },
): JSX.Element {
  const { type } = props;
  const Component = componentMap[type] as unknown as (
    p: InputTypeMap[T],
  ) => JSX.Element;
  return <Component {...(props as unknown as InputTypeMap[T])} />;
}
