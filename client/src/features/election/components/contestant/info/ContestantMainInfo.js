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
}) => {
  const { contestant_id, surname, firstname, picture, votes } = contestant;

  return (
    <>
      <ContestantPicture picture={picture} />
      <ContestantBasicInfo type="Name" value={`${surname} ${firstname}`} />
      <ContestantVotesInfoSummary
        showInfo={isButtonDisabled}
        contestantVotes={votes.length}
        totalVotes={totalVotes}
      />
      <ContestantVotesInfoStat
        showInfo={isButtonDisabled}
        contestantVotes={votes.length}
        totalVotes={totalVotes}
        contestantElectionStatusColor={votePercentColor[contestant_id]}
      />
    </>
  );
};
export default ContestantMainInfo;
