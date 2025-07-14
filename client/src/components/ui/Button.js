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
 * @param {String} [props.role] - ARIA role for the button (if a custom role is needed).
 * @param {String} [props.ariaLabel] - Defines a string label for screen readers.
 * @param {String} [props.ariaLabelledBy] - ID reference to another element that labels this button.
 * @param {String} [props.ariaDescribedBy] - ID reference to another element that describes this button.
 * @param {String} [props.title] - Native HTML title attribute for tooltips/screen readers.
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
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  title,
}) {
  return (
    <button
      type={type}
      name={name}
      onClick={onClick}
      disabled={disabled}
      className={`${defaultStyle.btn} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      title={title}
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
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  title: PropTypes.string,
};
