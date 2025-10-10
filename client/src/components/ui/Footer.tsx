import { CSSProperties, ReactNode, JSX, HTMLAttributes } from "react";

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * A reusable `<footer>` component for displaying footer content.
 *
 * Accessibility:
 * - Any valid HTML `<footer>` attribute (e.g., `role`, `aria-*`, `title`, etc.)
 *   can be passed directly via props.
 *
 * Styling:
 * - Accepts custom `className` and `style` for easy customization.
 */
export default function Footer({
  children,
  className = "",
  style,
  ...rest
}: FooterProps): JSX.Element {
  return (
    <footer className={className} style={style} {...rest}>
      {children}
    </footer>
  );
}
