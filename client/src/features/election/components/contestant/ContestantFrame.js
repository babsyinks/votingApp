import React from "react";
import Block from "components/ui/Block";
import style from "./ContestantFrame.module.css";
/**
 * Represents a frame for a single contestant. This frame is a container having the right structure and
 * formating to hold all pertinent information about a contestant. E.g name, picture, votes, etc.
 *
 * @param {Object} props Component prop.
 * @param {string} [props.className] - Additional classes to use to style the frame
 * @param {React.ReactNode} props.children - Child elements to render inside the contestant frame.
 * @returns {JSX.Element} The rendered ContestantFrame component.
 */
const ContestantFrame = ({ className = "", children }) => {
  return (
    <Block className={`${style.contestant} ${className}`}>{children}</Block>
  );
};
export default ContestantFrame;
