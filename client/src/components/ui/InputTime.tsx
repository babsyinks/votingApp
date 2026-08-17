import BaseInput, { BaseInputProps } from "./BaseInput";

export interface InputTimeProps extends Omit<BaseInputProps, "type"> {
  type?: "time";
  value: string;
}

/**
 * A component that renders a time input.
 *
 * @returns The rendered time input component.
 */
export default function InputTime({
  className = "",
  ...rest
}: InputTimeProps): JSX.Element {
  return <BaseInput {...rest} className={className} type="time" />;
}
