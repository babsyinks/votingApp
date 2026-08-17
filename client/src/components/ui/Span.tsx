import React from "react";

import defaultStyle from "./Base.module.css";
import getCompClasses from "../../util/getCompClasses";

export type SpanType =
  | "flex-vert"
  | "flex-horz"
  | "flex-vert-sb"
  | "flex-horz-sb"
  | "flex-vert-sa"
  | "flex-horz-sa"
  | "flex-vert-fs"
  | "flex-horz-fs"
  | "flex-vert-fe"
  | "flex-horz-fe"
  | "block"
  | "inline"
  | "inline-block"
  | "flex";

export interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The type of the span (e.g., "inline-block"). */
  type?: SpanType;
  /** Additional CSS class names. */
  className?: string;
  /** Inline styles. */
  style?: React.CSSProperties;
  /** Content inside the span. */
  children: React.ReactNode;
}

/**
 * A span element for inline text or components with optional styling.
 *
 * Accessibility:
 * - Any valid HTML span attribute (role, aria-*, title, etc.) may be passed and will be spread onto the element.
 */
export default function Span({
  type = "inline",
  className = "",
  style = {},
  children,
  ...rest
}: SpanProps): JSX.Element {
  return (
    <span
      className={`${defaultStyle[type]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );
}
