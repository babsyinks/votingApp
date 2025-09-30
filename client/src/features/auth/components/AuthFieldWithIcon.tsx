import InputWithIcon from "components/ui/InputWithIcon";
import { InputWithIconProps } from "components/ui/InputWithIcon";

export interface AuthFieldWithIconProps
  extends Omit<InputWithIconProps, "type"> {
  type?: "text" | "password" | "email" | "number";
}

export default function AuthFieldWithIcon({
  type = "text",
  rightIcon,
  ...otherProps
}: AuthFieldWithIconProps) {
  return (
    <InputWithIcon
      type={type}
      rightIcon={rightIcon}
      {...otherProps}
      className="bg-blue-faded neumorphic-input mb-2r"
    />
  );
}
