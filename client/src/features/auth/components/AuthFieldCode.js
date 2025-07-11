import AuthFieldWithIcon from "./AuthFieldWithIcon";

export default function AuthFieldCode({ value, onChange, maxLength = 6 }) {
  return (
    <AuthFieldWithIcon
      type="number"
      value={value}
      onChange={onChange}
      placeholder="Code"
      maxLength={maxLength}
      iconClass="fa-key"
    />
  );
}
