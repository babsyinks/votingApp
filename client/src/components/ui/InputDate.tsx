import { JSX } from "react";

import BaseInput, { BaseInputProps } from "./BaseInput";

export interface InputDateProps extends Omit<BaseInputProps, "type"> {
  type?: "date";
  value: string;
}

/**
 * A component that renders a date input.
 *
 * @returns The rendered date input component.
 */
export default function InputDate({
  className = "",
  ...rest
}: InputDateProps): JSX.Element {
  return <BaseInput {...rest} className={className} type="date" />;
}
