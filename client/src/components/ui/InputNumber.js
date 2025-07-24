import React from "react";
import PropTypes from "prop-types";
import BaseInput from "./BaseInput";
import defaultStyle from "./InputText.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A component that renders a number input.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - The name of the text input component.
 * @param {string} props.value - The value of the number input which is displayed.
 * @param {function} props.onChange - The function that runs whenever a number input is received.
 * @param {number} props.maxLength - Max length of input, e.g 6.
 * @param {string} props.placeholder - The default number to show when the component first renders.
 * @param {boolean} props.disabled - Indicates if the input should be disabled or not.
 * @param {string} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @returns {JSX.Element} The rendered input number component.
 */
export default function InputNumber(props) {
  const { className = "", maxLength, ...rest } = props;
  if (maxLength) {
    // compute max value from input length. E.g if maxLength = 4, max value will be 9999.
    const maxValue = +"".padEnd(maxLength, "9");
    rest.max = maxValue;
    rest.onInput = (e) => {
      const value = e.target.value;
      if (value[0] === "0") {
        e.target.value = "";
      }
      +value <= maxValue || (e.target.value = "");
    };
  }
  return (
    <BaseInput
      {...rest}
      className={`${defaultStyle["inp-txt"]} ${getCompClasses(defaultStyle, className)}`}
    />
  );
}

InputNumber.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
