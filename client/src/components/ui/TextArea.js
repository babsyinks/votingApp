import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./TextArea.module.css";
import getCompClasses from "../../util/getCompClasses";
import useOrientation from "../../hooks/useOrientation";

/**
 * A component that renders an accessible text area input.
 *
 * @param {Object} props - Component props.
 * @param {String} props.name - The name of the text area component.
 * @param {String} props.value - The value displayed in the text area.
 * @param {Object} props.dimension - Contains the rows and columns values of this component.
 * @param {Function} props.onChange - The function that runs whenever a text area input is received.
 * @param {String} props.placeholder - The default text to show when the component first renders.
 * @param {Boolean} props.disabled - Indicates if the text area should be disabled or not.
 * @param {String} [props.className] - Additional class names to style this component.
 * @param {Object} [props.style] - Inline styles to apply to the text area.
 * @param {String} [props.ariaLabel] - Defines a string label for screen readers.
 * @param {String} [props.ariaLabelledBy] - ID of element that labels this textarea.
 * @param {String} [props.ariaDescribedBy] - ID of element that describes this textarea.
 * @returns {JSX.Element} The rendered text area component.
 */
export default function TextArea({
  name,
  id = name,
  value,
  dimension: { rows = 10, cols = 40 } = {},
  onChange,
  placeholder,
  disabled = false,
  className = "",
  style = {},
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) {
  const isPortrait = useOrientation();
  if (isPortrait) {
    cols = 25;
  }

  return (
    <textarea
      id={id}
      name={name}
      value={value}
      rows={rows}
      cols={cols}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={`${defaultStyle["txt-area"]} ${getCompClasses(defaultStyle, className)}`}
      style={{ resize: "none", ...style }}
    />
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
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
};
