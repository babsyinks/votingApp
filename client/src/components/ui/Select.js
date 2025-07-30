import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Select.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A component that renders a select element.
 *
 * @param {Object} props - Component props.
 * @param {String} props.name - The name of the select component.
 * @param {String} props.value - The value of this component which is displayed on the select dropdown.
 * @param {Function} props.onChange - The function that runs whenever an item is selected.
 * @param {Array<Object>} props.selectOptions - The list of items to render as options in this component.
 * @param {Boolean} props.disabled - Indicates if this component should be disabled or not.
 * @param {String} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @param {String} [props.ariaLabel] - Aria label for screen readers.
 * @param {String} [props.ariaLabelledBy] - ID of a visible label element.
 * @param {String} [props.ariaDescribedBy] - ID of helper text element.
 * @returns {JSX.Element} The rendered select component.
 */
export default function Select({
  name,
  id = name,
  value,
  onChange,
  selectOptions,
  disabled = false,
  className = "",
  style = {},
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${defaultStyle.sel} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {selectOptions.map(({ optionLabel, optionValue }, i) => (
        <option value={optionValue || optionLabel.toLowerCase()} key={i}>
          {optionLabel}
        </option>
      ))}
    </select>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectOptions: PropTypes.arrayOf(
    PropTypes.shape({
      optionLabel: PropTypes.string.isRequired,
      optionValue: PropTypes.string,
    }).isRequired,
  ).isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
};
