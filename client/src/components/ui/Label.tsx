import React from "react";

import defaultStyle from "./Label.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** The name/id of the component this label is for (used for htmlFor) */
  name: string;
  /** Optional className for additional styling */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
  /** The label text (or React nodes) to display */
  children: React.ReactNode;
}

/**
 * A component that renders a label.
 *
 * Supports passing in any valid <label> attributes (e.g., role, aria-*, title) via props.
 */
export default function Label({
  name,
  className = "",
  style = {},
  children,
  ...rest
}: LabelProps): JSX.Element {
  return (
    <label
      htmlFor={name}
      className={`${defaultStyle["mg-r-5"]} ${defaultStyle["pd-05"]} ${getCompClasses(
        defaultStyle,
        className,
      )}`}
      style={style}
      {...rest}
    >
      {children}
    </label>
  );
}
