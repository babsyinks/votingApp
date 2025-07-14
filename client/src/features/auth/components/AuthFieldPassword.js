import { useState } from "react";
import AuthFieldWithIcon from "./AuthFieldWithIcon";
import I from "components/ui/I";

export default function AuthFieldPassword({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };

  return (
    <AuthFieldWithIcon
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder="Password"
      iconClass="fa-lock"
      rightIcon={
        <I
          className={`fas ${visible ? "fa-eye-slash" : "fa-eye"}`}
          onClick={toggleVisibility}
          withAccessibility
          role="button"
          ariaLabel="Toggle password visibility"
        />
      }
    />
  );
}
