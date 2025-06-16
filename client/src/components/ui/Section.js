import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Base.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A section component used for grouping related content.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the section. E.g flex-vert.
 * @param {String} [props.className] - Additional class names to style the section.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode} [props.children] - Child elements.
 * @returns {JSX.Element}
 */
export default function Section({
  type = "flex-vert",
  className = "",
  style = {},
  children,
}) {
  return (
    <section
      className={`${defaultStyle.section} ${defaultStyle[type]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </section>
  );
}

Section.propTypes = {
  type: PropTypes.oneOf([
    "flex-vert",
    "flex-horz",
    "flex-vert-sb",
    "flex-horz-sb",
    "flex-vert-sa",
    "flex-horz-sa",
    "flex-vert-fs",
    "flex-horz-fs",
    "flex-vert-fe",
    "flex-horz-fe",
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};
