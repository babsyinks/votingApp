import React from "react";
import defaultStyle from "./TextArea.module.css";
import getCompClasses from "../../util/getCompClasses";
import useOrientation from "../../hooks/useOrientation";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** The name of the text area component. */
  name: string;
  /** The value displayed in the text area. */
  value: string;
  /** Contains the rows and columns values of this component. */
  dimension?: {
    rows?: number;
    cols?: number;
  };
  /** Additional class names to style this component. */
  className?: string;
  /** Inline styles to apply to the text area. */
  style?: React.CSSProperties;
  /** Optional ID attribute. Defaults to the name. */
  id?: string;
}

/**
 * A component that renders an accessible text area input.
 *
 * @returns The rendered text area component.
 */
export default function TextArea({
  name,
  id = name,
  value,
  dimension = {},
  onChange,
  placeholder,
  disabled = false,
  className = "",
  style = {},
  ...rest
}: TextAreaProps): JSX.Element {
  const isPortrait = useOrientation();

  let { rows = 10, cols = 40 } = dimension;

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
      className={`${defaultStyle["txt-area"]} ${getCompClasses(
        defaultStyle,
        className
      )}`}
      style={{ resize: "none", ...style }}
      {...rest}
    />
  );
}
