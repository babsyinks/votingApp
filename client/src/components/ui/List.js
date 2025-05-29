import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./List.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A list component that renders ordered or unordered lists.
 *
 * @param {Object} props - Component props.
 * @param {"ul"|"ol"} [props.as] - Determines whether it's a <ul> or <ol>.
 * @param {String} [props.className] - Additional class names.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode} props.children - List items (should be <li> elements).
 * @returns {JSX.Element}
 */
export default function List({ as = "ul", className = "", style = {}, children }) {
  const Tag = as;
  return (
    <Tag
      className={`${defaultStyle[as]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </Tag>
  );
}

List.propTypes = {
  as: PropTypes.oneOf(["ul", "ol"]),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};
