import BaseInput, { BaseInputProps } from "./BaseInput";

export interface InputFileProps extends Omit<BaseInputProps, "type"> {
  type?: "file";
}

/**
 * A component that renders a file input.
 *
 * @returns The rendered input file component.
 */
export default function InputFile({
  className = "",
  ...rest
}: InputFileProps): JSX.Element {
  return <BaseInput {...rest} className={className} type="file"/>;
}
