import React from "react";
import { useSelector } from "react-redux";
import { userInfo } from "../../../user/userSlice";
import ContestantFrame from "./ContestantFrame";
import ContestantMainInfo from "./info/ContestantMainInfo";
import ContestantButtonManifesto from "./buttons/ContestantButtonManifesto";
import ContestantButtonVote from "./buttons/ContestantButtonVote";
import ContestantButtonVoteCompleted from "./buttons/ContestantButtonVoteCompleted";

/**
 * This component renders all main details about a contestant, e.g the basic information, vote
 * statistics, voting button and current voting state, e.t.c.
 * 
 * @param {Object} props - Component props.
 * @param {Object} [props.contestant] - The contestant object having all pertinent information about
 * the contestant.
 * @param {String} [props.position] - The position this contestant is contesting for. E.g President.
 * @param {Number} [props.totalVotes] - The total votes cast in a particular category. E.g total votes
 * cast for all contestants running for president.
 * @param {Boolean} [props.isButtonDisabled] - Indicates if the button is currently disabled.
 * @param {Object} [props.votePercentColor] - Object that maps the color status to each contestant. This
 * helps to use a color code to show the current status of each contestant in the election.
 * @param {Object} [props.manifestoControl] - Object having manifesto state and function to set it.
 * @returns {JSX.Element} The rendered ContestantMainView component.
 */
const ContestantMainView = ({
  contestant,
  position,
  totalVotes,
  isButtonDisabled,
  votePercentColor,
  manifestoControl,
}) => {
  const { contestant_id: contestantId, votes } = contestant;
  const { userId } = useSelector(userInfo);
  return (
    <ContestantFrame>
      <ContestantMainInfo
        contestant={contestant}
        totalVotes={totalVotes}
        isButtonDisabled={isButtonDisabled}
        votePercentColor={votePercentColor}
      />
      <ContestantButtonManifesto manifestoControl={manifestoControl} />
      {!isButtonDisabled ? (
        <ContestantButtonVote contestantId={contestantId} position={position} />
      ) : votes.includes(userId) ? (
        <ContestantButtonVoteCompleted votedFor={true} />
      ) : (
        <ContestantButtonVoteCompleted votedFor={false} />
      )}
    </ContestantFrame>
  );
};
export default ContestantMainView;
