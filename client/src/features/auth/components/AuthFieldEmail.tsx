import AuthFieldWithIcon from "./AuthFieldWithIcon";
import { AuthFieldBaseProps } from "../types/authFieldTypes";

export default function AuthFieldEmail({
  value,
  onChange,
}: AuthFieldBaseProps) {
  return (
    <AuthFieldWithIcon
      type="email"
      value={value}
      onChange={onChange}
      placeholder="Email"
      iconClass="fa-at"
    />
  );
}
