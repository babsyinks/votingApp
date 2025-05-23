import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Heading.module.css";
import getCompClasses from "../../util/getCompClasses";
/**
 * A component that renders a heading. E.g h1, h2, h3, etc.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the heading.
 * @param {String} [props.className] - The space-separated classNames to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @param {React.ReactNode} [props.children] - Child elements to render inside this component.
 * @returns {JSX.Element} The rendered heading component.
 */
export default function Heading({
  type = "h1",
  className = "",
  style = {},
  children,
}) {
  const headingType = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)
    ? type
    : "h1";
  const allClassNames = `${defaultStyle.heading} ${getCompClasses(defaultStyle, className)}`;
  return React.createElement(
    headingType,
    { className: allClassNames, style },
    children,
  );
}

Heading.propTypes = {
  type: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};
