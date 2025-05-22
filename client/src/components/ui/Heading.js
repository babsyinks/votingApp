import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Heading.module.css";
import getCompClasses from "../../util/getCompClasses";
/**
 * A component that renders a heading. E.g h1, h2, h3, etc.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the heading.
 * @param {Object} [props.custom] - Additional classes and styles to be passed to this component
 * @param {String} [props.className] - The className to use to additionally style this component.
 * @param {React.ReactNode} props.children - Child elements to render inside this component.
 * @returns {JSX.Element} The rendered heading component.
 */
export default function Heading({
  type = "h1",
  custom = { custClass: "", custStyle: {} },
  children,
  className,
}) {
  const { custClass = "", custStyle = {} } = custom;
  const headingType = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)
    ? type
    : "h1";
  const cn = `${defaultStyle.heading} ${getCompClasses(defaultStyle, custClass)} ${className}`;
  return React.createElement(
    headingType,
    { className: cn, style: custStyle },
    children,
  );
}

Heading.propTypes = {
  type: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
  style: PropTypes.object,
  children: PropTypes.node,
};
