import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Base.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A span element for inline text or components with optional styling.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the span. E.g inline-block.
 * @param {string} [props.className] - ClassName(s) for styling.
 * @param {Object} [props.style] - Inline styles.
 * @param {function} [props.onClick] - The function that runs whenever a span is clicked.
 * @param {React.ReactNode} props.children - Content inside the span.
 * @returns {JSX.Element} The rendered span element.
 */
export default function Span({
  type = "inline",
  className = "",
  style = {},
  onClick,
  children,
}) {
  return (
    <span
      className={`${defaultStyle[type]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      onClick={onClick}
    >
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
