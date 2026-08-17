import React from "react";
import Span from "components/ui/Span";
import ContestantVotesInfo from "./ContestantVotesInfo";

export interface ContestantVotesInfoStatProps {
  /** Indicates if the votes percentage should be displayed or not. */
  showInfo: boolean;
  /** The votes obtained so far by the contestant in the ongoing election. */
  contestantVotes: number;
  /** The total votes cast in a given category in the election. */
  totalVotes?: number;
  /** The color-code showing the contestant standing in the election. */
  contestantElectionStatusColor?: string;
}

/**
 * This shows the percentage of votes obtained by a contestant relative to other contestants. 
 * It also assigns the proper color to emphasize the standing of the contestant in the election.
 */
const ContestantVotesInfoStat: React.FC<ContestantVotesInfoStatProps> = ({
  showInfo,
  contestantVotes,
  totalVotes = 0,
  contestantElectionStatusColor,
}) => {
  const getContestantVotePercent = (): string => {
    let contestantVotePercent: number;
    if (contestantVotes === 0 && totalVotes === 0) {
      contestantVotePercent = 0;
    } else {
      contestantVotePercent = (contestantVotes / totalVotes) * 100;
    }
    return `${Math.round(contestantVotePercent)}%`;
  };

  return (
    <ContestantVotesInfo type="Vote Percent" showInfo={showInfo}>
      <Span>
        <Span
          className="fs-italic fw-bold p-5p bg-black border-rounded-100p"
          style={{ color: contestantElectionStatusColor }}
        >
          {getContestantVotePercent()}
        </Span>
      </Span>
    </ContestantVotesInfo>
  );
};

export default ContestantVotesInfoStat;
