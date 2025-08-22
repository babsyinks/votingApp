import React from "react";
import PropTypes from "prop-types";
import Input from "./Input";
import Block from "./Block";
import I from "./I";
import defaultStyle from "./InputWithIcon.module.css";
import getCompClasses from "../../util/getCompClasses";

export default function InputWithIcon({ iconClass, rightIcon, ...inputProps }) {
  const { className = "" } = inputProps;

  return (
    <Block className={`${defaultStyle["input-icon-wrapper"]}`}>
      {iconClass && (
        <I className={`fas ${iconClass} ${defaultStyle["input-icon"]}`} />
      )}
      <Input
        {...inputProps}
        className={`${defaultStyle["input-with-icon"]} ${getCompClasses(defaultStyle, className)}`}
      />
      {rightIcon && (
        <Block className={defaultStyle["input-icon-right"]}>{rightIcon}</Block>
      )}
    </Block>
  );
}

InputWithIcon.propTypes = {
  iconClass: PropTypes.string,
  rightIcon: PropTypes.node,
};
