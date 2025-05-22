import React, { useState } from "react";
import ContestantMainView from "./ContestantMainView";
import ContestantManifestoView from "./ContestantManifestoView";

const Contestant = ({
  contestant,
  position,
  totalVotes,
  isButtonDisabled,
  votePercentColor,
}) => {
  const [showManifesto, setShowManifesto] = useState(false);
  const manifestoControl = { showManifesto, setShowManifesto };
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
export default Contestant;
