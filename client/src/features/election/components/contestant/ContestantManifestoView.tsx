import React from "react";
import ContestantFrame from "./ContestantFrame";
import ContestantManifestoInfo from "./info/ContestantManifestoInfo";
import ContestantButtonManifesto from "./buttons/ContestantButtonManifesto";
import { ManifestoControl } from "features/election/types/manifestoControlType";

export interface ContestantManifestoViewProps {
  manifesto: string;
  manifestoControl: ManifestoControl;
}

/**
 * This component renders the manifesto of the contestant. Given that the manifesto could be a
 * long text, it is separated from the component showing the other details about the contestant.
 */
const ContestantManifestoView: React.FC<ContestantManifestoViewProps> = ({
  manifesto,
  manifestoControl,
}) => {
  return (
    <ContestantFrame>
      <ContestantManifestoInfo manifesto={manifesto} />
      <ContestantButtonManifesto manifestoControl={manifestoControl} />
    </ContestantFrame>
  );
};

export default ContestantManifestoView;
