import React from "react";
import PropTypes from "prop-types";
import BaseInput from "./BaseInput";

/**
 * A component that renders a time input.
 *
 * @param {Object} props - Component props.
 * @param {String} props.name - The name of the time input component.
 * @param {String} props.value - The value of the time input.
 * @param {Function} props.onChange - Function called when time input changes.
 * @param {Boolean} props.disabled - Indicates if the input should be disabled.
 * @param {String} [props.className] - Additional classes for styling.
 * @param {Object} [props.style] - Inline styles.
 * @returns {JSX.Element} The rendered time input component.
 */
export default function InputTime(props) {
  const { className = "", ...rest } = props;

  return <BaseInput {...rest} className={className} />;
}

InputTime.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
