import React from "react";
import ContestantBasicInfo from "./ContestantBasicInfo";
import ContestantPicture from "./ContestantPicture";
import ContestantVotesInfoSummary from "./ContestantVotesInfoSummary";
import ContestantVotesInfoStat from "./ContestantVotesInfoStat";

const ContestantMainInfo = ({
  contestant,
  totalVotes,
  isButtonDisabled,
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
        showInfo={isButtonDisabled}
        contestantVotes={votes.length}
        totalVotes={totalVotes}
        showExpandedStats={showExpandedStats}
      />
      {showExpandedStats && (
        <ContestantVotesInfoStat
          showInfo={showInfo}
          contestantVotes={votes.length}
          totalVotes={totalVotes}
          contestantElectionStatusColor={votePercentColor[contestant_id]}
        />
      )}
    </>
  );
};
export default ContestantMainInfo;
