import React, { CSSProperties, ReactNode } from "react";
import useOrientation from "hooks/useOrientation";

type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "space-around"
  | "space-between"
  | "space-evenly"
  | "stretch";

type AlignItems =
  | "flex-start"
  | "flex-end"
  | "start"
  | "end"
  | "center"
  | "baseline"
  | "stretch";

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";

/**
 * Props for the Container layout component.
 *
 * @property justifyContent - Controls alignment along the main axis (defaults to "center").
 *   Note: with flex-direction: column it affects horizontal layout; with row it affects vertical layout.
 * @property alignItems - Controls alignment along the cross axis (defaults to "center").
 * @property flexDirection - Layout direction for children (defaults to "column").
 * @property flexWrap - How children wrap when there's insufficient space (defaults to "nowrap").
 * @property backgroundImage - Optional CSS value for background-image (e.g. `url("/img.png")` or `linear-gradient(...)`).
 * @property children - React nodes rendered inside the container.
 * @property flipDirectionOnOrientationChange - If true, flip the flexDirection when device orientation changes.
 * @property height - Optional CSS height value (defaults to "100vh").
 * @property width - Optional CSS width value (defaults to "100vw").
 * @property className - Optional CSS class(es) to apply to the root element.
 */
export interface ContainerProps {
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  flexDirection?: FlexDirection;
  flexWrap?: CSSProperties["flexWrap"];
  backgroundImage?: string;
  children: ReactNode;
  flipDirectionOnOrientationChange?: boolean;
  height?: string;
  width?: string;
  className?: string;
}

/**
 * Container
 *
 * A flexible layout wrapper that sets basic flexbox layout rules for its children.
 * It supports flipping the flex direction when device orientation changes (portrait/landscape).
 *
 * Defaults:
 * - justifyContent: "center"
 * - alignItems: "center"
 * - flexDirection: "column"
 * - flexWrap: "nowrap"
 * - flipDirectionOnOrientationChange: false
 * - height: "100vh"
 * - width: "100vw"
 *
 * @param props ContainerProps
 * @returns JSX.Element
 */
const Container: React.FC<ContainerProps> = ({
  justifyContent = "center",
  alignItems = "center",
  flexDirection = "column",
  flexWrap = "nowrap",
  backgroundImage,
  children,
  flipDirectionOnOrientationChange = false,
  height = "100vh",
  width = "100vw",
  className = "",
  ...rest
}) => {
  const isPortrait = useOrientation();

  // Mapping from a flexDirection to its "complement" when orientation flips.
  const objComplements: Record<FlexDirection, FlexDirection> = {
    row: "column",
    column: "row",
    "row-reverse": "column-reverse",
    "column-reverse": "row-reverse",
  };

  const containerStyle: CSSProperties = {
    display: "flex",
    justifyContent,
    alignItems,
    flexDirection,
    height,
    width,
    flexWrap,
  };

  if (backgroundImage) {
    // backgroundImage should be a valid CSS background-image value, e.g. `url('/img.png')`
    containerStyle.backgroundImage = backgroundImage;
  }

  if (flipDirectionOnOrientationChange) {
    containerStyle.flexDirection = isPortrait
      ? objComplements[flexDirection]
      : flexDirection;
  }

  return (
    <div className={className} style={containerStyle} {...rest}>
      {children}
    </div>
  );
};

export default Container;
