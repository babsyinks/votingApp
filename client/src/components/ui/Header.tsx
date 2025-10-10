import { CSSProperties, ReactNode, JSX, HTMLAttributes } from "react";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * A reusable `<header>` component for displaying site-wide header content.
 *
 * Accessibility:
 * - Any valid HTML `<header>` attribute (e.g., `role`, `aria-*`, `title`, etc.)
 *   can be passed directly via props.
 *
 * Styling:
 * - Accepts custom `className` and `style` for easy customization.
 */
export default function Header({
  children,
  className = "",
  style,
  ...rest
}: HeaderProps): JSX.Element {
  return (
    <header className={className} style={style} {...rest}>
      {children}
    </header>
  );
}
