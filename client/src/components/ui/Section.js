import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Section.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A section component used for grouping related content.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.className] - Additional class names to style the section.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode} [props.children] - Child elements.
 * @returns {JSX.Element}
 */
export default function Section({ className = "", style = {}, children }) {
  return (
    <section
      className={`${defaultStyle.section} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </section>
  );
}

Section.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};
