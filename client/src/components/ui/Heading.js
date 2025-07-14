import React from "react";
import PropTypes from "prop-types";

/**
 * A component that renders a semantic heading (h1–h6) and optionally supports accessibility attributes directly.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The heading tag to render (e.g., 'h1').
 * @param {String} [props.className] - Class names for styling.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode} [props.children] - The heading content.
 * @param {String} [props.role] - Optional ARIA role.
 * @param {String} [props.ariaLabel] - ARIA label.
 * @param {String} [props.ariaLabelledBy] - ID of element that labels this heading.
 * @param {String} [props.ariaDescribedBy] - ID of element that describes this heading.
 * @param {String} [props.title] - Tooltip or accessibility label.
 */
export default function Heading({
  type = "h1",
  className = "",
  style = {},
  children,
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  title,
}) {
  const headingType = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)
    ? type
    : "h1";

  return React.createElement(
    headingType,
    {
      className,
      style,
      role,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      title,
    },
    children
  );
}

Heading.propTypes = {
  type: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  title: PropTypes.string,
};
