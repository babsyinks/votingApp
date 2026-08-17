import React from "react";
import Span from "components/ui/Span";
import ContestantVotesInfo from "./ContestantVotesInfo";

export interface ContestantVotesInfoSummaryProps {
  /** Indicates if the votes obtained by the contestant should be displayed or not */
  showInfo: boolean;
  /** The votes obtained so far by the contestant in the ongoing election */
  contestantVotes: number;
  /** The total votes cast in a given category in the election */
  totalVotes?: number;
  /** Indicates if more voting data should be displayed or not */
  showExpandedStats: boolean;
}

/**
 * It details the summary of current election voting status for a contestant; 
 * it shows the votes obtained by a contestant out of total votes cast.
 */
const ContestantVotesInfoSummary: React.FC<ContestantVotesInfoSummaryProps> = ({
  showInfo,
  contestantVotes,
  totalVotes,
  showExpandedStats,
}) => {
  return (
    <ContestantVotesInfo type="Votes" showInfo={showInfo}>
      <Span>
        <Span className="text-purple-cool fs-italic px-0-py-5p">
          {contestantVotes}
        </Span>{" "}
        {showExpandedStats && (
          <>
            out of{" "}
            <Span className="text-purple-dark fs-italic">{totalVotes}</Span>
          </>
        )}
      </Span>
    </ContestantVotesInfo>
  );
};

export default ContestantVotesInfoSummary;
