import React from "react";
import PropTypes from "prop-types";

/**
 * A span element for inline text or components with optional styling.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - ClassName(s) for styling.
 * @param {Object} [props.style] - Inline styles.
 * @param {function} [props.onClick] - The function that runs whenever a span is clicked.
 * @param {React.ReactNode} props.children - Content inside the span.
 * @returns {JSX.Element} The rendered span element.
 */
export default function Span({
  className = "",
  style = {},
  onClick,
  children,
}) {
  return (
    <span className={className} style={style} onClick={onClick}>
      {children}
    </span>
  );
}

Span.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};
