import React from "react";
import Block from "components/ui/Block";
import Button from "components/ui/Button";

interface ContestantButtonManifestoTemplateProps {
  /** The event handler acting on click events of this button */
  handler?: () => void;
  /** Additional classes to use to style the button */
  className?: string;
  /** Additional inline styling to use to style this button */
  style?: React.CSSProperties;
  /** Child elements to render inside this component */
  children?: React.ReactNode;
}

/**
 * This component is a template for manifesto buttons. It renders a manifesto button and sets behaviour
 * and appearance based on the passed props.
 */
const ContestantButtonManifestoTemplate: React.FC<
  ContestantButtonManifestoTemplateProps
> = ({ handler, className = "", style = {}, children }) => {
  return (
    <Block>
      <Button
        onClick={handler}
        className={`rnd-corner-btn rnd-corner-btn-sized ${className}`}
        style={style}
      >
        {children}
      </Button>
    </Block>
  );
};

export default ContestantButtonManifestoTemplate;
