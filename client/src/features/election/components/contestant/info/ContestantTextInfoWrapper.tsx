import React from "react";
import Block from "components/ui/Block";
import style from "./ContestantTextInfoWrapper.module.css";

export interface ContestantTextInfoWrapperProps {
  /** Child elements to render inside this component */
  children?: React.ReactNode;
}

/**
 * Wraps a contestant's textual information details. E.g basic information or voting statistics.
 */
const ContestantTextInfoWrapper: React.FC<ContestantTextInfoWrapperProps> = ({
  children,
}) => {
  return <Block className={style["info-wrapper"]}>{children}</Block>;
};

export default ContestantTextInfoWrapper;
