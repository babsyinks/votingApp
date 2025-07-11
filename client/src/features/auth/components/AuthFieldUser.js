import AuthFieldWithIcon from "./AuthFieldWithIcon";

export default function AuthFieldUser({ value, onChange, placeholder }) {
  return (
    <AuthFieldWithIcon
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      iconClass="fa-user"
    />
  );
}
