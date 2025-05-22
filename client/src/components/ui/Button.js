import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Button.module.css";
import getCompClasses from "../../util/getCompClasses";
/**
 * A component that renders a button
 *
 * @param {Object} props - Component props.
 * @param {String} props.name - The name of the button input component.
 * @param {String} props.type - The button type. Can be any of button, reset or submit.
 * @param {Function} props.onClick - The function that runs whenever a button is clicked.
 * @param {Boolean} props.disabled - Indicates if the button should be disabled or not.
 * @param {Object} props.custom - Optional object to customize the styling of this component.
 * @param {React.ReactNode | String} props.children - Child elements or string to render inside the button.
 * @returns {JSX.Element} The rendered button component.
 */
export default function Button({
  name = "",
  type = "button",
  onClick,
  disabled = false,
  custom = { custClass: "", custStyle: {} },
  children,
}) {
  const { custClass = "", custStyle = {} } = custom;
  return (
    <button
      type={type}
      name={name}
      onClick={onClick}
      disabled={disabled}
      className={`${defaultStyle.btn} ${getCompClasses(defaultStyle, custClass)}`}
      style={custStyle || {}}
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
  custom: PropTypes.shape({
    custClass: PropTypes.string,
    custStyle: PropTypes.object,
  }),
  children: PropTypes.node,
};
