import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Grid from "layout/Grid";
import ContestantView from "./contestant/ContestantView";
import { userInfo } from "features/user/userSlice";
import assignVoteStatusColor from "../helpers/assignVoteStatusColor";
import { ContestantType } from "../types/contestantType";


export interface ElectivePositionDetailsContestantsProps {
  contestantsList: ContestantType[];
  listOfVotesCastInCategory: string[];
  position: string;
}

const ElectivePositionDetailsContestants: React.FC<
  ElectivePositionDetailsContestantsProps
> = ({ contestantsList, listOfVotesCastInCategory, position }) => {
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
  const [votePercentColor, setVotePercentColor] = useState<
    Record<string, string>
  >({});
  const { userId } = useSelector(userInfo);

  const colorizeVotePercent = (contestants: ContestantType[]) => {
    const colorStatusObj = assignVoteStatusColor(contestants);
    setVotePercentColor(colorStatusObj);
  };

  useEffect(() => {
    colorizeVotePercent(contestantsList);
  }, [contestantsList]);

  useEffect(() => {
    if (listOfVotesCastInCategory.includes(userId)) {
      setButtonIsDisabled(true);
    }
  }, [userId, listOfVotesCastInCategory]);

  return (
    <Grid>
      {contestantsList.map((contestant) => (
        <ContestantView
          contestant={contestant}
          position={position}
          totalVotes={listOfVotesCastInCategory.length}
          isButtonDisabled={buttonIsDisabled}
          votePercentColor={votePercentColor}
          key={contestant.contestant_id}
        />
      ))}
    </Grid>
  );
};

export default ElectivePositionDetailsContestants;
