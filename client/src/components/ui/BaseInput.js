// components/ui/BaseInput.js
import React from "react";
import PropTypes from "prop-types";

/**
 * BaseInput is a reusable, low-level component that renders an HTML input element.
 * It supports multiple types (e.g., text, password, file, date, time) and can be
 * customized via standard input props such as `value`, `onChange`, `placeholder`,
 * `disabled`, `className`, `style`, and others.
 *
 * This component is designed to be used internally by higher-level input components
 * like InputText, InputDate, InputFile, etc., to avoid repeating boilerplate rendering logic.
 *
 * @param {Object} props - The props used to configure the input.
 * @param {string} [props.type] - The input type (e.g., "text", "file", "date", "time").
 * @param {string} [props.name] - The name attribute for the input element.
 * @param {string} [props.value] - The value of the input (not used for file inputs).
 * @param {function} props.onChange - The function to call on input change.
 * @param {string} [props.placeholder] - Placeholder text for the input (if applicable).
 * @param {boolean} [props.disabled] - Whether the input should be disabled.
 * @param {number} [props.resetKey] - Key used to forcefully reset the input (mainly for file inputs).
 * @param {string} [props.className] - Additional class names for styling.
 * @param {Object} [props.style] - Inline styles for the input.
 * @param {string} [props.accept] - A string defining file types the file input should accept (for file input only).
 *
 * @returns {JSX.Element} A styled <input> element.
 */
export default function BaseInput({
  type,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  resetKey,
  className = "",
  style = {},
  accept,
}) {
  return (
    <input
      key={resetKey}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      style={style}
      accept={accept}
    />
  );
}

BaseInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  resetKey: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  accept: PropTypes.string,
};
