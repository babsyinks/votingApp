import React from "react";
import style from "./ContestantFrame.module.css";
/**
 * Represents a frame for a single contestant. This frame is a container having the right structure and
 * formating to hold all pertinent information about a contestant. E.g name, picture, votes, etc.
 * 
 * @param {Object} props Component prop.
 * @param {React.ReactNode} props.children - Child elements to render inside the contestant frame.
 * @returns {JSX.Element} The rendered ContestantFrame component.
 */
const ContestantFrame = ({ children }) => {
  return (
    <div
      className={style.contestant}
    >
      {children}
    </div>
  );
};
export default ContestantFrame;
