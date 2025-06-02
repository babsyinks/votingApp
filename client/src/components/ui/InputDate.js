import React from "react";
import PropTypes from "prop-types";
import BaseInput from "./BaseInput";

/**
 * A component that renders a date input.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - The name of the date input component.
 * @param {string} props.value - The value of the date input.
 * @param {function} props.onChange - Function called when date input changes.
 * @param {boolean} props.disabled - Indicates if the input should be disabled.
 * @param {string} [props.className] - Additional classes for styling.
 * @param {Object} [props.style] - Inline styles.
 * @returns {JSX.Element} The rendered date input component.
 */
export default function InputDate(props) {
  const { className = "", ...rest } = props;

  return <BaseInput {...rest} className={className} />;
}

InputDate.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
