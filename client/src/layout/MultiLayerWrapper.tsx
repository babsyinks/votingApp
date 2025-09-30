import React from "react";
import Block from "components/ui/Block";
import useWindowSize from "hooks/useWindowSize";

/**
 * This component wraps its children in 2 layers. The first layer is the background while the
 * second one is the content layer that the children will be rendered in.
 */
export interface MultiLayerWrapperProps {
  children: React.ReactNode;
}

/**
 * MultiLayerWrapper Component
 *
 * Renders two nested Block components:
 * - The outer Block acts as the background layer.
 * - The inner Block is the content container for children.
 *
 * The padding of the outer layer adjusts based on screen width.
 *
 * @returns {JSX.Element} The rendered MultiLayerWrapper component.
 */
const MultiLayerWrapper: React.FC<MultiLayerWrapperProps> = ({ children }) => {
  const { width } = useWindowSize();
  const pad = width < 800 ? "p-2r" : "";

  return (
    <Block
      type="flex-horz"
      className={`mnh-100vh ${pad}`}
      data-testid="outer-block"
    >
      <Block
        className="bg-white-transparent border-rounded-16 p-2r mxw-600 w-full ta-center bs-black fadeIn"
        data-testid="inner-block"
      >
        {children}
      </Block>
    </Block>
  );
};

export default MultiLayerWrapper;
