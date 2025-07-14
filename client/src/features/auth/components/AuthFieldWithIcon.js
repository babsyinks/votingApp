import InputWithIcon from "components/ui/InputWithIcon";

export default function AuthFieldWithIcon({ type = "text", rightIcon, ...otherProps }) {
  return (
    <InputWithIcon
      type={type}
      rightIcon={rightIcon}
      {...otherProps}
      className="bg-blue-faded neumorphic-input mb-2r"
    />
  );
}
