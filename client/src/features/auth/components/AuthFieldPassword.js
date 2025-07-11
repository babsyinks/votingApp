import AuthFieldWithIcon from "./AuthFieldWithIcon";

export default function AuthFieldPassword({ value, onChange }) {
  return (
    <AuthFieldWithIcon
      type="password"
      value={value}
      onChange={onChange}
      placeholder="Password"
      iconClass="fa-lock"
    />
  );
}
