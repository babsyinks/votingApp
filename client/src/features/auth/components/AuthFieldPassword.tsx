import { useState } from "react";
import AuthFieldWithIcon from "./AuthFieldWithIcon";
import I from "components/ui/I";
import { AuthFieldBaseProps } from "../types/authFieldTypes";

export default function AuthFieldPassword({
  value,
  onChange,
  placeholder = "Password",
}: AuthFieldBaseProps) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };

  return (
    <AuthFieldWithIcon
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      iconClass="fa-lock"
      rightIcon={
        <I
          className={`fas ${visible ? "fa-eye-slash" : "fa-eye"}`}
          onClick={toggleVisibility}
          role="button"
          aria-label="Toggle password visibility"
        />
      }
    />
  );
}
