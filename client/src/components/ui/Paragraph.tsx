import React from "react";
import defaultStyle from "./Paragraph.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Additional class names to style the paragraph. */
  className?: string;
  /** Inline styles. */
  style?: React.CSSProperties;
  /** Text or elements inside the paragraph. */
  children: React.ReactNode;
  /** Indicates if the default paragraph styling should be used. */
  useDefaultStyle?: boolean;
}

/**
 * A paragraph component to render passed in content.
 *
 * Accessibility:
 * - `<p>` is a semantic paragraph element, no `aria-*` is needed in normal use.
 * - Supports any valid paragraph attributes (including `role`, `aria-*`, `title`, `id`, etc.)
 *   through `...rest` for flexibility in special cases.
 *
 * @returns The rendered paragraph element.
 */
export default function Paragraph({
  className = "",
  style = {},
  children,
  useDefaultStyle = true,
  ...rest
}: ParagraphProps): JSX.Element {
  return (
    <p
      className={`${useDefaultStyle ? defaultStyle.paragraph : ""} ${getCompClasses(
        defaultStyle,
        className
      )}`}
      style={style}
      {...rest}
    >
      {children}
    </p>
  );
}
