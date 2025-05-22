import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./TextArea.module.css";
import getCompClasses from "../../util/getCompClasses";
import useOrientation from "../../hooks/useOrientation";

/**
 * A component that renders a text area.
 *
 * @param {Object} props - Component props.
 * @param {String} props.name - The name of the text area component.
 * @param {String} props.value - The value displayed in the text area.
 * @param {Object} props.dimension - Contains the rows and columns values of this component.
 * @param {Function} props.onChange - The function that runs whenever a text area input is received.
 * @param {String} props.placeholder - The default text to show when the component first renders.
 * @param {Boolean} props.disabled - Indicates if the text area should be disabled or not.
 * @param {Object} props.custom - Optional object to customize the textarea style.
 * @returns {JSX.Element} The rendered text area component.
 */
export default function TextArea({
  name,
  value,
  dimension: { rows = 10, cols = 40 } = {},
  onChange,
  placeholder,
  disabled = false,
  custom = { custClass: "", custStyle: {} },
}) {
  const { custClass, custStyle } = custom;
  const isPortrait = useOrientation();
  if (isPortrait) {
    cols = 25;
  }
  return (
    <textarea
      name={name}
      value={value}
      rows={rows}
      cols={cols}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${defaultStyle["txt-area"]} ${getCompClasses(defaultStyle, custClass)}`}
      style={{ resize: "none", ...custStyle }}
    ></textarea>
  );
}

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  dimension: PropTypes.shape({
    rows: PropTypes.string,
    cols: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  custom: PropTypes.shape({
    custClass: PropTypes.string,
    custStyle: PropTypes.object,
  }),
};
