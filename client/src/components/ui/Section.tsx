import React from "react";
import defaultStyle from "./Base.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * Supported section layout types.
 */
export type SectionType =
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
  | "flex";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The type of the section. E.g. flex-vert */
  type?: SectionType;
  /** Additional class names to style the section. */
  className?: string;
  /** Inline styles. */
  style?: React.CSSProperties;
  /** Child elements. */
  children?: React.ReactNode;
}

/**
 * A section component used for grouping related content.
 *
 * @returns The rendered section element.
 */
export default function Section({
  type = "flex-vert",
  className = "",
  style = {},
  children,
  ...rest
}: SectionProps): JSX.Element {
  return (
    <section
      className={`${defaultStyle.section} ${defaultStyle[type]} ${getCompClasses(
        defaultStyle,
        className
      )}`}
      style={style}
      {...rest}
    >
      {children}
    </section>
  );
}
