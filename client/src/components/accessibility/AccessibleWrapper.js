import React from "react";
import PropTypes from "prop-types";

/**
 * A wrapper for applying accessibility props to supported elements.
 * @param {string} [props.role] - Defines the ARIA role of the input element.
 * @param {string} [props.ariaLabel] - Defines a string label for screen readers (maps to `aria-label`).
 * @param {string} [props.ariaLabelledBy] - ID of the element that labels the input (maps to `aria-labelledby`).
 * @param {string} [props.ariaDescribedBy] - ID of the element that describes the input (maps to `aria-describedby`).
 * @param {string} [props.ariaDisabled] - ID of the element that disables the input (maps to `aria-disabled`).
 * @param {string} [props.title] - Native tooltip text shown on hover and read by screen readers.
 *
 * @returns {JSX.Element} An element wrapped with accessibility features.
 */
export default function AccessibleWrapper({
  children,
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaDisabled,
  title,
}) {
  if (!React.isValidElement(children)) return null;

  const propsToAdd = {
    ...(role ? { role } : {}),
    ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
    ...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {}),
    ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
    ...(ariaDisabled ? { "aria-disabled": ariaDisabled } : {}),
    ...(title ? { title } : {}),
  };

  return React.cloneElement(children, propsToAdd);
}

AccessibleWrapper.propTypes = {
  children: PropTypes.element,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  title: PropTypes.string,
};
