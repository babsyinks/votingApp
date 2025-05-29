import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Paragraph.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A paragraph component to render text content.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.className] - Additional class names to style the paragraph.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode | String} props.children - Text or elements inside the paragraph.
 * @returns {JSX.Element}
 */
export default function Paragraph({ className = "", style = {}, children }) {
  return (
    <p
      className={`${defaultStyle.paragraph} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </p>
  );
}

Paragraph.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};
