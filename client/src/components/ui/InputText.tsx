import BaseInput, { BaseInputProps } from "./BaseInput";
import defaultStyle from "./InputText.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface InputTextProps extends Omit<BaseInputProps, "type"> {
  type?: "text" | "password" | "email";
  value: string;
}

/**
 * A component that renders a text input.
 *
 * @returns The rendered input text component.
 */
export default function InputText({
  className = "",
  type = "text",
  ...rest
}: InputTextProps): JSX.Element {
  return (
    <BaseInput
      {...rest}
      type={type}
      className={`${defaultStyle["inp-txt"]} ${getCompClasses(
        defaultStyle,
        className,
      )}`}
    />
  );
}
