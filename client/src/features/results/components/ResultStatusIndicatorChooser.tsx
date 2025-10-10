import Span from "components/ui/Span";
import ResultStatusIndicatorWinner from "./ResultStatusIndicatorWinner";
import ResultStatusIndicatorTie from "./ResultStatusIndicatorTie";
import ResultStatusIndicatorLoser from "./ResultStatusIndicatorLoser";

export interface ResultStatusIndicatorChooserProps {
  contestantTotalVotes: number;
  isTie: boolean;
  index: number;
}

export default function ResultStatusIndicatorChooser({
  contestantTotalVotes,
  isTie,
  index,
}: ResultStatusIndicatorChooserProps) {
  return (
    <Span>
      {index === 0 ? (
        isTie === false ? (
          contestantTotalVotes > 0 && <ResultStatusIndicatorWinner />
        ) : (
          <ResultStatusIndicatorTie />
        )
      ) : isTie ? (
        <ResultStatusIndicatorTie />
      ) : (
        <ResultStatusIndicatorLoser />
      )}
    </Span>
  );
}
