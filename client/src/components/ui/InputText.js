import React from "react";
import defaultStyle from "./InputText.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A component that renders a text input.
 *
 * @param {Object} props - Component props.
 * @param {String} props.type - The type of the Input. It must be one of "text" and "password"
 * @param {String} props.name - The name of the text input component.
 * @param {String} props.value - The value of the text input which is displayed in a text box.
 * @param {Function} props.onChange - The function that runs whenever a text input is received.
 * @param {String} props.placeholder - The default text to show when the component first renders.
 * @param {Boolean} props.disabled - Indicates if the input text box should be disabled or not.
 * @param {String} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @returns {JSX.Element} The rendered input text component.
 */
export default function InputText({
  type,
  name = "",
  value,
  onChange,
  placeholder,
  disabled,
  className = "",
  style = {},
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${defaultStyle["inp-txt"]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    />
  );
}
