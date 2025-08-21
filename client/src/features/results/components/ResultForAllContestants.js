import Block from "components/ui/Block";
import ResultForContestant from "./ResultForContestant";
import getTieStatus from "../helpers/getTieStatus";

export default function ResultForAllContestants({ sortedResults }) {
  let highestVote = sortedResults[0].votes.length;
  return (
    <Block>
      <Block type="flex-horz" className="flex-wrap px-0-py-10">
        {sortedResults.map((contestant, i) => {
          const isTie = getTieStatus({
            sortedResults,
            index: i,
            votes: contestant.votes,
            highestVote,
          });

          return (
            <ResultForContestant
              contestant={contestant}
              isTie={isTie}
              index={i}
              key={i}
            />
          );
        })}
      </Block>
    </Block>
  );
}
