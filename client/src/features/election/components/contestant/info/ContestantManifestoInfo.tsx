import React from "react";
import Block from "components/ui/Block";

export interface ContestantManifestoInfoProps {
  /** The manifesto text of the contestant */
  manifesto: string;
}

const ContestantManifestoInfo: React.FC<ContestantManifestoInfoProps> = ({
  manifesto,
}) => {
  return <Block className="fw-normal ta-left">{manifesto}</Block>;
};

export default ContestantManifestoInfo;
