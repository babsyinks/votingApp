import React from "react";
import PropTypes from "prop-types";

/**
 * A span element for inline text or components with optional styling.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.className] - ClassName(s) for styling.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode} props.children - Content inside the span.
 * @returns {JSX.Element} The rendered span element.
 */
export default function Span({ className = "", style = {}, children }) {
  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
}

Span.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};
