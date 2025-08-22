import ContestantFrame from "features/election/components/contestant/ContestantFrame";
import ContestantMainInfo from "features/election/components/contestant/info/ContestantMainInfo";
import ResultStatusIndicatorChooser from "./ResultStatusIndicatorChooser";

export default function ResultForContestant({ contestant, isTie, index }) {
  return (
    <ContestantFrame className="mb-10">
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
