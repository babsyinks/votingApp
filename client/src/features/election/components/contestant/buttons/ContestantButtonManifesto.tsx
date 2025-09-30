import React from "react";
import ContestantButtonManifestoTemplate from "./ContestantButtonManifestoTemplate";
import { ManifestoControl } from "features/election/types/manifestoControlType";

export interface ContestantButtonManifestoProps {
  manifestoControl: ManifestoControl;
}

/**
 * This component represents the button that can show or hide the manifesto of a single contestant
 * when clicked.
 */
const ContestantButtonManifesto: React.FC<ContestantButtonManifestoProps> = ({
  manifestoControl,
}) => {
  const { showManifesto, setShowManifesto } = manifestoControl;

  if (!showManifesto) {
    return (
      <ContestantButtonManifestoTemplate
        handler={() => setShowManifesto(true)}
        className="swp-col-blv"
      >
        Read Manifesto
      </ContestantButtonManifestoTemplate>
    );
  } else {
    return (
      <ContestantButtonManifestoTemplate
        handler={() => setShowManifesto(false)}
        className="swp-col-crm"
        style={{ marginTop: "5px" }}
      >
        Close Manifesto
      </ContestantButtonManifestoTemplate>
    );
  }
};

export default ContestantButtonManifesto;
