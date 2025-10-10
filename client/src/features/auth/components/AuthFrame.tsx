import React from "react";
import Block from "components/ui/Block";
import { BlockProps } from "components/ui/Block";

/**
 * Props for the AuthFrame component
 */
export interface AuthFrameProps extends BlockProps {
  /** Whether the frame should take up the full viewport height */
  isFull?: boolean;
}

/**
 * A wrapper frame used for authentication screens, with a background and centered inner content.
 *
 * @param props - Component props
 * @returns A styled authentication frame
 */
export default function AuthFrame({
  className = "",
  type = "flex-horz",
  isFull = true,
  children,
}: AuthFrameProps): JSX.Element {
  const minHeight = isFull ? "mnh-100vh" : "";
  return (
    <Block
      type={type}
      className={`bg-blue-faded ${minHeight} px-1r-py-0r flex ${className}`}
      data-testid="authframe-outer"
    >
      <Block
        className="bg-blue-faded border-rounded-1r bs-blue-faded w-full mxw-28r p-2r mt-1p5r"
        data-testid="authframe-inner"
      >
        {children}
      </Block>
    </Block>
  );
}
