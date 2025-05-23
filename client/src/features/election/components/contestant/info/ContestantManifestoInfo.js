import React from "react";
import Block from "../../../../../components/ui/Block";
import style from "./ContestantManifestoInfo.module.css";

const ContestantManifestoInfo = ({ manifesto }) => {
  return <Block className={style["manifesto-info"]}>{manifesto}</Block>;
};

export default ContestantManifestoInfo;
