import { CSSProperties, ReactNode, JSX } from "react";
import defaultStyle from "./Button.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * A reusable button component.
 *
 * Accessibility:
 * - Any valid HTML `<button>` attribute (e.g., `role`, `aria-*`, `title`, etc.)
 *   can be passed directly.
 *
 * Styling:
 * - Uses CSS module classes from `Button.module.css`.
 * - The `className` prop can be used to apply additional styling.
 */
export default function Button({
  type = "button",
  className = "",
  style,
  children,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={`${defaultStyle.btn} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}
