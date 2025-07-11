import React from "react";
import PropTypes from "prop-types";
import Input from "./Input";
import Block from "./Block";
import I from "./I";
import defaultStyle from "./InputWithIcon.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A component that renders an input with an icon.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.iconClass] - The icon class to use on the input. e.g fa-user.
 * @param {Object} [props.inputProps] - The props of the input component to render
 * @returns {JSX.Element} The rendered input text component.
 */
export default function InputWithIcon({ iconClass, ...inputProps }) {
  const { className = "" } = inputProps;
  return (
    <Block className={`${defaultStyle["input-icon-wrapper"]}`}>
      <I className={`fas ${iconClass} ${defaultStyle["input-icon"]}`} />
      <Input
        {...inputProps}
        className={`${defaultStyle["input-with-icon"]} ${getCompClasses(defaultStyle, className)}`}
      />
    </Block>
  );
}

InputWithIcon.propTypes = {
  iconClass: PropTypes.string.isRequired,
  inputProps: PropTypes.object,
};
