import React from "react";
import PropTypes from "prop-types";
import useOrientation from "../hooks/useOrientation";

/**
 * This component wraps its children components, dictating how they should be laid out. It is the
 * main wrapper that sets the structure of how its children components are to be displayed. It uses
 * flexbox to layout its children.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.justifyContent] - Based on the flex direction (default is column), it determines horizontal layout
 * of contents, however, if flex-direction is row, it determines vertical layout of contents.
 * @param {String} [props.alignItems] - Similar to the justifyContent, but acts in opposite. That is it determines vertical
 * layout, but if flex-direction is row, it determines horizontal layout.
 * @param {String} [props.flexDirection] - The layout direction. E.g if contents should be laid out horizontally or vertically.
 * @param {String} [props.flexWrap] - Determines how components should the laid out when there is no space left to place them.
 * @param {String} [props.backgroundImage] - Optional background image of the container.
 * @param {React.ReactNode} props.children - Child elements to render inside the wrapper.
 * @param {Boolean} [props.flipDirectionOnOrientationChange] - Determines if flex-direction specific properties should be applied
 * to the layout whenever there is a change of orientation.
 * @param {String} [props.className] - Optional className(s) to style the layout.
 * @returns {JSX.Element} The rendered wrapper component.
 */
const Container = ({
  justifyContent = "center",
  alignItems = "center",
  flexDirection = "column",
  flexWrap = "nowrap",
  backgroundImage,
  children,
  flipDirectionOnOrientationChange = false,
  className = "",
}) => {
  const isPortrait = useOrientation();
  const objComplements = {
    row: "column",
    column: "row",
    "row-reverse": "column-reverse",
    "column-reverse": "row-reverse",
  };
  const containerStyle = {
    display: "flex",
    justifyContent,
    alignItems,
    flexDirection,
    height: "100vh",
    overflowX: "hidden",
    overflowY: "scroll",
    flexWrap,
  };

  if (backgroundImage) {
    containerStyle.backgroundImage = backgroundImage;
  }

  if (flipDirectionOnOrientationChange) {
    containerStyle.flexDirection = isPortrait
      ? objComplements[flexDirection]
      : flexDirection;
  }

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};

export default Container;

Container.propTypes = {
  justifyContent: PropTypes.oneOf([
    "flex-start",
    "flex-end",
    "start",
    "end",
    "left",
    "right",
    "center",
    "space-around",
    "space-between",
    "space-evenly",
    "stretch",
  ]),
  alignItems: PropTypes.oneOf([
    "flex-start",
    "flex-end",
    "start",
    "end",
    "center",
    "baseline",
    "stretch",
  ]),
  flexDirection: PropTypes.oneOf([
    "row",
    "row-reverse",
    "column",
    "column-reverse",
  ]),
  backgroundImage: PropTypes.string,
  children: PropTypes.node,
  flipDirectionOnOrientationChange: PropTypes.bool,
};
