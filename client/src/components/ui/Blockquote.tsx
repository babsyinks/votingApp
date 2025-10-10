import { ReactNode, CSSProperties, JSX } from "react";
import defaultStyle from "./Base.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface BlockquoteProps
  extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * A reusable component for displaying quotes.
 *
 * Accessibility:
 * - Any valid HTML `<blockquote>` attribute (e.g., `role`, `aria-*`, `title`, etc.)
 *   can be passed directly.
 *
 * Styling:
 * - Uses CSS module classes from `Base.module.css`.
 * - The `className` prop can be used to apply additional styling.
 */
export default function Blockquote({
  children,
  className = "",
  style,
  ...rest
}: BlockquoteProps): JSX.Element {
  return (
    <blockquote
      className={`${getCompClasses(defaultStyle, className)}`}
      style={style}
      {...rest}
    >
      {children}
    </blockquote>
  );
}
