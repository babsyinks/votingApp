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
 * @param {Object} props.custom - Optional object to customize the styling of this component.
 * @returns {JSX.Element} The rendered label component.
 */
export default function Label({
  name,
  custom = { custClass: "", custStyle: {} },
  children,
}) {
  const { custClass = "", custStyle = {} } = custom;
  return (
    <label
      htmlFor={name}
      className={`${defaultStyle["mg-r-5"]} ${defaultStyle["pd-05"]} ${getCompClasses(defaultStyle, custClass)}`}
      style={custStyle || {}}
    >
      {children}
    </label>
  );
}

Label.propTypes = {
  name: PropTypes.string.isRequired,
  custom: PropTypes.shape({
    custClass: PropTypes.string,
    custStyle: PropTypes.object,
  }),
};
