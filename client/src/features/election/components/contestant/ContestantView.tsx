import React, { useState } from "react";
import ContestantMainView from "./ContestantMainView";
import ContestantManifestoView from "./ContestantManifestoView";
import { ContestantType } from "features/election/types/contestantType";
import { ManifestoControl } from "features/election/types/manifestoControlType";

export interface ContestantViewProps {
  contestant: ContestantType;
  position: string;
  totalVotes: number;
  isButtonDisabled: boolean;
  votePercentColor: Record<string, string>;
}

const ContestantView: React.FC<ContestantViewProps> = ({
  contestant,
  position,
  totalVotes,
  isButtonDisabled,
  votePercentColor,
}) => {
  const [showManifesto, setShowManifesto] = useState(false);
  const manifestoControl: ManifestoControl = { showManifesto, setShowManifesto };

  if (!showManifesto) {
    return (
      <ContestantMainView
        contestant={contestant}
        position={position}
        totalVotes={totalVotes}
        isButtonDisabled={isButtonDisabled}
        votePercentColor={votePercentColor}
        manifestoControl={manifestoControl}
      />
    );
  } else {
    return (
      <ContestantManifestoView
        manifesto={contestant.manifesto}
        manifestoControl={manifestoControl}
      />
    );
  }
};

export default ContestantView;
