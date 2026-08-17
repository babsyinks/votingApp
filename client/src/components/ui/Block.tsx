import { ReactNode, CSSProperties, JSX } from "react";

import defaultStyle from "./Base.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  type?:
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
    | "flex"
    | "grid";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * A block component that renders its children inside a div.
 *
 * Accessibility:
 * - Any valid HTML `div` attribute (e.g., `role`, `aria-*`, `title`, etc.)
 *   can be passed directly.
 *
 * Styling:
 * - Uses CSS module classes from `Base.module.css`.
 * - The `type` prop controls the layout type (e.g. flex, grid, block).
 * - The `className` prop can be used to apply additional styling.
 */
export default function Block({
  type = "block",
  className = "",
  style,
  children,
  ...rest
}: BlockProps): JSX.Element {
  return (
    <div
      className={`${defaultStyle[type]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
