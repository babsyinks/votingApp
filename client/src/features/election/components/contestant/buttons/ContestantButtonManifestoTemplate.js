import React from "react";
import Block from "../../../../../components/ui/Block";
import Button from "../../../../../components/ui/Button";

/**
 * This component is a template for manifesto buttons. It renders manifesto button and sets behaviour
 * and appearance based on the passed props.
 *
 * @param {Object} props - Component props.
 * @param {Function} [props.handler] - The event handler acting on click events of this button
 * @param {String} [props.custClass] - Additional classes to use to style the button.
 * @param {Object} [props.custStyle] - Additional inline styling to use to style this button.
 * @param {React.ReactNode} [props.children] - Child elements to render inside this component.
 * @returns {JSX.Element} The rendered button template component.
 */
const ContestantButtonManifestoTemplate = ({
  handler,
  custClass,
  custStyle = {},
  children,
}) => {
  return (
    <Block>
      <Button
        onClick={handler}
        custom={{
          custClass: `rnd-corner-btn ${custClass}`,
          custStyle,
        }}
      >
        {children}
      </Button>
    </Block>
  );
};
export default ContestantButtonManifestoTemplate;
