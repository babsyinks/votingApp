import React from "react";
import ContestantBasicInfo from "./ContestantBasicInfo";
import ContestantPicture from "./ContestantPicture";
import ContestantVotesInfoSummary from "./ContestantVotesInfoSummary";
import ContestantVotesInfoStat from "./ContestantVotesInfoStat";
import { ContestantType } from "features/election/types/contestantType";

export interface ContestantMainInfoProps {
  contestant: ContestantType;
  totalVotes?: number;
  showInfo: boolean;
  votePercentColor?: Record<string, string>;
  showExpandedStats?: boolean;
}

const ContestantMainInfo: React.FC<ContestantMainInfoProps> = ({
  contestant,
  totalVotes,
  showInfo,
  votePercentColor,
  showExpandedStats = true,
}) => {
  const { contestant_id, surname, firstname, picture, votes } = contestant;

  return (
    <>
      <ContestantPicture
        picture={picture}
        showFullPicture={!showExpandedStats}
      />
      <ContestantBasicInfo type="Name" value={`${surname} ${firstname}`} />
      <ContestantVotesInfoSummary
        showInfo={showInfo}
        contestantVotes={votes.length}
        totalVotes={totalVotes}
        showExpandedStats={showExpandedStats}
      />
      {showExpandedStats && (
        <ContestantVotesInfoStat
          showInfo={showInfo}
          contestantVotes={votes.length}
          totalVotes={totalVotes}
          contestantElectionStatusColor={votePercentColor?.[contestant_id]}
        />
      )}
    </>
  );
};

export default ContestantMainInfo;
