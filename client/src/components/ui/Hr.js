import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Hr.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A horizontal rule component for separating parts of a page.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.className] - ClassName(s) for styling.
 * @param {Object} [props.style] - Inline styles.
 * @returns {JSX.Element} The rendered <i> element.
 */
export default function Hr({ className = "", style = {} }) {
  return (
    <hr
      className={`${defaultStyle["hr-line"]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    />
  );
}

Hr.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};
