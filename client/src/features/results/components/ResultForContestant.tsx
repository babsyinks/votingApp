import ContestantFrame from "features/election/components/contestant/ContestantFrame";
import ContestantMainInfo from "features/election/components/contestant/info/ContestantMainInfo";
import ResultStatusIndicatorChooser from "./ResultStatusIndicatorChooser";
import type { ContestantType } from "features/election/types/contestantType";

export interface ResultForContestantProps {
  contestant: ContestantType;
  isTie: boolean;
  index: number;
}

export default function ResultForContestant({
  contestant,
  isTie,
  index,
}: ResultForContestantProps) {
  return (
    <ContestantFrame className="mb-10p">
      <ContestantMainInfo
        contestant={contestant}
        showInfo={true}
        showExpandedStats={false}
      />
      <ResultStatusIndicatorChooser
        contestantTotalVotes={contestant.votes.length}
        isTie={isTie}
        index={index}
      />
    </ContestantFrame>
  );
}
