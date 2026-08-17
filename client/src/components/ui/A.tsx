import { ReactNode, CSSProperties, JSX } from "react";

import defaultStyle from "./A.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface AProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  target?: "_self" | "_blank" | "_parent" | "_top";
  rel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * A reusable <a> (anchor) component for external or internal links.
 */
export default function A({
  href,
  children,
  target = "_self",
  rel = "",
  className = "",
  style = {},
  ...rest
}: AProps): JSX.Element {
  return (
    <a
      href={href}
      target={target}
      rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={`${defaultStyle.link} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      {...rest}
    >
      {children}
    </a>
  );
}
