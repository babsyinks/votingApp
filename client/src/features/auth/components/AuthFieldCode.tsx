import AuthFieldWithIcon from "./AuthFieldWithIcon";
import { AuthFieldBaseProps } from "../types/authFieldTypes";

export default function AuthFieldCode({
  value,
  onChange,
  maxLength = 6,
}: AuthFieldBaseProps) {
  return (
    <AuthFieldWithIcon
      type="number"
      name="auth-field-code"
      value={value}
      onChange={onChange}
      placeholder="Code"
      maxLength={maxLength}
      iconClass="fa-key"
    />
  );
}
