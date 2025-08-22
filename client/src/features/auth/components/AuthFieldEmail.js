import AuthFieldWithIcon from "./AuthFieldWithIcon";

export default function AuthFieldEmail({ value, onChange }) {
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
