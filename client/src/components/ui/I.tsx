import React from "react";

export interface IProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLElement>;
  children?: React.ReactNode;
}

/**
 * An `<i>` element for icons or emphasized inline text.
 *
 * Accessibility:
 * - Any valid HTML `<i>` attribute (e.g., `role`, `aria-*`, `title`, etc.)
 *   can be passed directly via props.
 *
 * Styling:
 * - Controlled via `className` and `style`.
 */
export default function I({
  className = "",
  style,
  onClick,
  children,
  ...rest
}: IProps): React.JSX.Element {
  return (
    <i
      className={className}
      style={style}
      onClick={onClick}
      {...rest}
    >
      {children}
    </i>
  );
}
