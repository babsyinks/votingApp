import React from "react";

/**
 * A component that renders a file input.
 *
 * @param {Object} props - Component props.
 * @param {String} props.name - The name of the file input component.
 * @param {Number} props.resetKey - The key used to reset the file input field.
 * @param {Function} props.onChange - The function that runs whenever a file input is received.
 * @param {Boolean} props.disabled - Indicates if the input file picker should be disabled or not.
 * @param {Object} props.custom - Optional object to customize the styling of this component
 * @returns {JSX.Element} The rendered input file component.
 */
export default function InputFile({
  name,
  resetKey,
  onChange,
  disabled,
  custom = { custClass: "", custStyle: {} },
}) {
  const { custClass = "", custStyle = {} } = custom;
  return (
    <input
      type="file"
      name={name}
      key={resetKey}
      onChange={onChange}
      disabled={disabled}
      className={custClass || ""}
      style={custStyle || {}}
    />
  );
}
