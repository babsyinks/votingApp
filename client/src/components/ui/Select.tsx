import React from "react";

import defaultStyle from "./Select.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface SelectOption {
  /** The label to display for this option. */
  optionLabel: string;
  /** The underlying value of this option. If omitted, `optionLabel.toLowerCase()` is used. */
  optionValue?: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** The name of the select component. */
  name: string;
  /** The id attribute of the select component. Defaults to `name`. */
  id?: string;
  /** The current selected value. */
  value: string;
  /** Callback when the selected value changes. */
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  /** The list of items to render as options. */
  selectOptions: SelectOption[];
  /** Indicates if this component should be disabled. */
  disabled?: boolean;
  /** Additional class names to style this component. */
  className?: string;
  /** Additional inline styles to style this component. */
  style?: React.CSSProperties;
}

/**
 * A component that renders a select element.
 *
 * @returns The rendered select component.
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
  ...rest
}: SelectProps): JSX.Element {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${defaultStyle.sel} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      {...rest}
    >
      {selectOptions.map(({ optionLabel, optionValue }, i) => (
        <option value={optionValue ?? optionLabel.toLowerCase()} key={i}>
          {optionLabel}
        </option>
      ))}
    </select>
  );
}
