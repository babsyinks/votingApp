import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Heading.module.css";

/**
 * A component that renders a heading. E.g h1, h2, h3, etc.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the heading.
 * @param {Object} [props.style] - Additional styles to be passed to this component
 * @param {React.ReactNode} props.children - Child elements to render inside this component.
 * @returns {JSX.Element} The rendered heading component.
 */
export default function Heading({ type = "h1", style = {}, children }) {
  const headingType = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)
    ? type
    : "h1";
  const className = `${defaultStyle.heading} ${defaultStyle[type] || ""}`;

  return React.createElement(headingType, { className, style }, children);
}

Heading.propTypes = {
  type: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
  style: PropTypes.object,
  children: PropTypes.node,
};
