import React from "react";
import PropTypes from "prop-types";
import BaseInput from "./BaseInput";
import defaultStyle from "./InputText.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A component that renders a text input.
 *
 * @param {Object} props - Component props.
 * @param {string} props.type - The type of the Input. It must be one of "text" and "password"
 * @param {string} props.name - The name of the text input component.
 * @param {string} props.value - The value of the text input which is displayed in a text box.
 * @param {function} props.onChange - The function that runs whenever a text input is received.
 * @param {string} props.placeholder - The default text to show when the component first renders.
 * @param {boolean} props.disabled - Indicates if the input text box should be disabled or not.
 * @param {string} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @returns {JSX.Element} The rendered input text component.
 */
export default function InputText(props) {
  const { className = "", ...rest } = props;

  return (
    <BaseInput
      {...rest}
      className={`${defaultStyle["inp-txt"]} ${getCompClasses(defaultStyle, className)}`}
    />
  );
}

InputText.propTypes = {
  type: PropTypes.oneOf(["text", "password"]).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};