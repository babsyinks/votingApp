import React from "react";
import Block from "components/ui/Block";
import defaultStyle from "./Grid.module.css";
import getCompClasses from "util/getCompClasses";

/**
 * A Grid component that lists items in a grid, auto-filling the screen with the items based on
 * available screen space.
 */
export interface GridProps {
  /**
   * The className(s) to additionally style this component.
   * Class names can come from the CSS module or external styling.
   */
  className?: string;
  /**
   * Additional inline styles to apply to this component.
   */
  style?: React.CSSProperties;
  /**
   * Child elements to render inside the Grid.
   */
  children: React.ReactNode;
  /**
   * Indicates if the default grid styling should be used.
   */
  useDefaultStyle?: boolean;
}

/**
 * Renders a flexible Grid layout component.
 *
 * @param props - The Grid component props.
 * @returns The rendered Grid component.
 */
export default function Grid({
  className = "",
  style = {},
  children,
  useDefaultStyle = true,
}: GridProps): JSX.Element {
  return (
    <Block
      type="grid"
      className={`${useDefaultStyle ? defaultStyle.grid : ""} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </Block>
  );
}
