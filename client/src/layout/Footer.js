import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Footer.module.css";
import getCompClasses from "util/getCompClasses";

/**
 * A reusable <footer> component for displaying site-wide footer content.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.className] - Additional class names for styling.
 * @param {Object} [props.style] - Inline styles.
 * @param {String} [props.role] - ARIA role attribute.
 * @param {String} [props.ariaLabel] - ARIA label for screen readers.
 * @param {String} [props.ariaLabelledBy] - ID reference of a label element.
 * @param {String} [props.ariaDescribedBy] - ID reference of a description element.
 * @returns {JSX.Element} The rendered <footer> element with copyright.
 */
export default function Footer({
  className = "",
  style = {},
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`${defaultStyle.footer} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      © {year} Corestack Technologies
    </footer>
  );
}

Footer.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
};
