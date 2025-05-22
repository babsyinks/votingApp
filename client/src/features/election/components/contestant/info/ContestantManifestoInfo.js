import React from "react";
import Block from "../../../../../components/ui/Block";

const ContestantManifestoInfo = ({ manifesto }) => {
  return (
    <Block custom={{ custStyle: { fontWeight: "normal", textAlign: "left" } }}>
      {manifesto}
    </Block>
  );
};

export default ContestantManifestoInfo;
