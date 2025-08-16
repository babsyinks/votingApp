import React from "react";
import PropTypes from "prop-types";

/**
 * A reusable <header> component for displaying site-wide header content.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The header content (e.g., logo, nav, contact info).
 * @param {String} [props.className] - Additional class names for styling.
 * @param {Object} [props.style] - Inline styles.
 * @param {String} [props.role] - ARIA role attribute.
 * @param {String} [props.ariaLabel] - ARIA label for screen readers.
 * @param {String} [props.ariaLabelledBy] - ID reference of a label element.
 * @param {String} [props.ariaDescribedBy] - ID reference of a description element.
 * @returns {JSX.Element} The rendered <header> element.
 */
export default function Header({
  children,
  className = "",
  style = {},
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) {
  return (
    <header
      className={className}
      style={style}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </header>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
};
