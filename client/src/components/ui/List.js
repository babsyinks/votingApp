import React from "react";
import PropTypes from "prop-types";
import Li from "./Li";
import defaultStyle from "./List.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A list component that renders ordered or unordered lists.
 *
 * @param {Object} props - Component props.
 * @param {"ul"|"ol"} [props.as] - Determines whether it's a <ul> or <ol>.
 * @param {String} [props.className] - Additional class names.
 * @param {Object} [props.style] - Inline styles.
 * @param {Array} [props.items] - List items.
 * @param {React.ReactNode} [props.children] - Optional children (should be <li> elements). One of items
 * or children must be set.
 * @returns {JSX.Element}
 */
export default function List({
  as = "ul",
  className = "",
  style = {},
  items = [],
  children,
}) {
  const Tag = as;
  return (
    <Tag
      className={`${defaultStyle[as]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children
        ? children
        : items.map((item, i) => (
            <Li key={item?.id || i}>{item?.content || item}</Li>
          ))}
    </Tag>
  );
}

List.propTypes = {
  as: PropTypes.oneOf(["ul", "ol"]),
  className: PropTypes.string,
  style: PropTypes.object,
  items: PropTypes.array,
  children: PropTypes.node,
};
