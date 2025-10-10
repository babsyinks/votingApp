import React from "react";
import Li from "./Li";
import defaultStyle from "./List.module.css";
import getCompClasses from "../../util/getCompClasses";

export type ListItem =
  | string
  | number
  | {
      id?: string | number;
      content?: React.ReactNode;
    };

export interface ListProps {
  /** Determines whether it's a <ul> or <ol>. */
  as?: "ul" | "ol";
  /** Additional class names. */
  className?: string;
  /** Inline styles. */
  style?: React.CSSProperties;
  /** List items to render (if `children` are not provided). */
  items?: ListItem[];
  /** Optional children (should be <li> elements). */
  children?: React.ReactNode;
}

/**
 * A list component that renders ordered or unordered lists.
 *
 * @returns The rendered list (<ul> or <ol>).
 */
export default function List({
  as = "ul",
  className = "",
  style = {},
  items = [],
  children,
}: ListProps): JSX.Element {
  const Tag = as as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={`${defaultStyle[as]} ${getCompClasses(
        defaultStyle,
        className,
      )}`}
      style={style}
    >
      {children
        ? children
        : items.map((item, i) => (
            <Li key={typeof item === "object" ? (item?.id ?? i) : i}>
              {typeof item === "object" ? (item.content ?? null) : item}
            </Li>
          ))}
    </Tag>
  );
}
