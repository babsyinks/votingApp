import InputWithIcon from "components/ui/InputWithIcon";

export default function AuthFieldWithIcon({ type = "text", ...otherProps }) {
  return (
    <InputWithIcon
      type={type}
      {...otherProps}
      className="bg-blue-faded neumorphic-input mb-2r"
    />
  );
}
