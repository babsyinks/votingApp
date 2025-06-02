import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./A.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A reusable <a> (anchor) component for external or internal links.
 *
 * @param {Object} props - Component props.
 * @param {String} props.href - The URL the link points to.
 * @param {React.ReactNode} props.children - Link content.
 * @param {String} [props.target] - Where to open the linked document.
 * @param {String} [props.rel] - The relationship between current and linked page.
 * @param {String} [props.className] - Additional class names for styling.
 * @param {Object} [props.style] - Inline styles.
 * @returns {JSX.Element} The rendered <a> element.
 */
export default function A({
  href,
  children,
  target = "_self",
  rel = "",
  className = "",
  style = {},
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={`${defaultStyle.link} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </a>
  );
}

A.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  target: PropTypes.oneOf(["_self", "_blank", "_parent", "_top"]),
  rel: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};
