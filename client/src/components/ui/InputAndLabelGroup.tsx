import Input from "./Input";
import Label from "./Label";
import Block from "./Block";
import { BaseInputProps } from "./BaseInput";

export interface InputAndLabelGroupProps extends BaseInputProps {
  /** The label text to display beside the input */
  label: string;
}

/**
 * A component that renders a label and an input together inside a Block.
 *
 */
export default function InputAndLabelGroup({
  label,
  ...rest
}: InputAndLabelGroupProps): JSX.Element {
  return (
    <Block>
      <Label name={rest.name ?? ""}>{label}</Label>
      <Input {...rest} />
    </Block>
  );
}
