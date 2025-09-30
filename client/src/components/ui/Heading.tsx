import React, { CSSProperties, ReactNode, JSX, HTMLAttributes } from "react";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The semantic heading type to render. Defaults to `h1`. */
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * A component that renders a semantic heading (`<h1>`–`<h6>`).
 *
 * Accessibility:
 * - Any valid HTML heading attribute (e.g., `role`, `aria-*`, `title`, etc.)
 *   can be passed directly via props.
 *
 * Styling:
 * - Supports `className` and inline `style` for customization.
 */
export default function Heading({
  type = "h1",
  className = "",
  style,
  children,
  ...rest
}: HeadingProps): JSX.Element {

  return React.createElement(
    type,
    {
      className,
      style,
      ...rest,
    },
    children
  );
}
