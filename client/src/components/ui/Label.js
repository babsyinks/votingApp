import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Label.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A component that renders a label.
 *
 * @param {Object} props - Component props.
 * @param {String} props.children - The label text to be displayed.
 * @param {String} props.name - The name of the component this label is being used for. E.g a text input.
 * @param {String} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @returns {JSX.Element} The rendered label component.
 */
export default function Label({
  name,
  className = "",
  style = {},
  children,
}) {
  return (
    <label
      htmlFor={name}
      className={`${defaultStyle["mg-r-5"]} ${defaultStyle["pd-05"]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </label>
  );
}

Label.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};
