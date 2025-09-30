import React from "react";

export interface LiProps {
  /** Additional class names to apply to the <li> element */
  className?: string;
  /** Inline styles to apply to the <li> element */
  style?: React.CSSProperties;
  /** The content to render inside the list item */
  children: React.ReactNode;
}

/**
 * A list item component.
 *
 * @returns The rendered list item (<li>) element.
 */
export default function Li({
  className = "",
  style = {},
  children,
}: LiProps): JSX.Element {
  return (
    <li className={className} style={style}>
      {children}
    </li>
  );
}
