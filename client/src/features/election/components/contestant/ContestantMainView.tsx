import { useSelector } from "react-redux";
import { userInfo } from "../../../user/userSlice";
import ContestantFrame from "./ContestantFrame";
import ContestantMainInfo from "./info/ContestantMainInfo";
import ContestantButtonManifesto from "./buttons/ContestantButtonManifesto";
import ContestantButtonVote from "./buttons/ContestantButtonVote";
import ContestantButtonVoteCompleted from "./buttons/ContestantButtonVoteCompleted";
import { ManifestoControl } from "features/election/types/manifestoControlType";
import { ContestantType } from "features/election/types/contestantType";

export interface ContestantMainViewProps {
  contestant: ContestantType;
  position: string;
  totalVotes: number;
  isButtonDisabled: boolean;
  votePercentColor: Record<string, string>;
  manifestoControl: ManifestoControl;
}

/**
 * This component renders all main details about a contestant, e.g the basic information, vote
 * statistics, voting button and current voting state, e.t.c.
 */
const ContestantMainView: React.FC<ContestantMainViewProps> = ({
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
        showInfo={isButtonDisabled}
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
