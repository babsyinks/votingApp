import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Button.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A component that renders a button
 *
 * @param {Object} [props] - Component props.
 * @param {String} [props.name] - The name of the button input component.
 * @param {String} [props.type] - The button type. Can be any of button, reset or submit.
 * @param {Function} [props.onClick] - The function that runs whenever a button is clicked.
 * @param {Boolean} [props.disabled] - Indicates if the button should be disabled or not.
 * @param {String} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @param {React.ReactNode | String} props.children - Child elements or string to render inside the button.
 * @returns {JSX.Element} The rendered button component.
 */
export default function Button({
  name = "",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  style = {},
  children,
}) {
  return (
    <button
      type={type}
      name={name}
      onClick={onClick}
      disabled={disabled}
      className={`${defaultStyle.btn} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  name: PropTypes.string,
  type: PropTypes.oneOf(["button", "reset", "submit"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};
