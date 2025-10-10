import AuthFieldWithIcon from "./AuthFieldWithIcon";
import { AuthFieldBaseProps } from "../types/authFieldTypes";

export default function AuthFieldUser({
  value,
  onChange,
  placeholder,
}: AuthFieldBaseProps) {
  return (
    <AuthFieldWithIcon
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      iconClass="fa-user"
    />
  );
}
