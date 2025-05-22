import React from "react";
import style from "./ContestantTextInfoWrapper.module.css";
/**
 * Wraps a contestant's textual information details. E.g basic information or voting statistics.
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} [props.children] - Child elements to render inside this component.
 * @returns {JSX.Element} The rendered ContestantTextInfoWrapper component.
 */
const ContestantTextInfoWrapper = ({ children }) => {
  return (
    <div className={style["info-wrapper"]}>
      {children}
    </div>
  );
};

export default ContestantTextInfoWrapper;