import React from "react";
import PropTypes from "prop-types";
import BaseInput from "./BaseInput";

/**
 * A component that renders a file input.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - The name of the file input component.
 * @param {number} props.resetKey - The key used to reset the file input field.
 * @param {function} props.onChange - The function that runs whenever a file input is received.
 * @param {boolean} props.disabled - Indicates if the input file picker should be disabled or not.
 * @param {string} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @param {string} [props.accept] - A string defining file types the file input should accept.
 * @returns {JSX.Element} The rendered input file component.
 */
export default function InputFile(props) {
  const { className = "", ...rest } = props;

  return <BaseInput {...rest} className={className} />;
}

InputFile.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  resetKey: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  accept: PropTypes.string,
};
