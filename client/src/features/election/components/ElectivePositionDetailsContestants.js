import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Grid from "../../../layout/Grid";
import Contestant from "./contestant/Contestant";
import { userInfo } from "../../user/userSlice";
import assignVoteStatusColor from "../helpers/assignVoteStatusColor";

const ElectivePositionDetailsContestants = ({
  contestantsList,
  listOfVotesCastInCategory,
  position,
}) => {
  const [buttonisDisabled, setButtonisDisabled] = useState(false);
  const [votePercentColor, setVotePercentColor] = useState({});
  const { userId } = useSelector(userInfo);

  const colorizeVotePercent = (contestants) => {
    const colorStatusObj = assignVoteStatusColor(contestants);
    setVotePercentColor(colorStatusObj);
  };

  useEffect(() => {
    colorizeVotePercent(contestantsList);
  }, [contestantsList]);

  useEffect(() => {
    if (listOfVotesCastInCategory.includes(userId)) {
      setButtonisDisabled(true);
    }
  }, [userId, setButtonisDisabled, listOfVotesCastInCategory]);

  return (
    <Grid>
      {contestantsList.map((contestant) => {
        return (
          <Contestant
            contestant={contestant}
            position={position}
            totalVotes={listOfVotesCastInCategory.length}
            isButtonDisabled={buttonisDisabled}
            votePercentColor={votePercentColor}
            key={contestant.contestant_id}
          />
        );
      })}
    </Grid>
  );
};
export default ElectivePositionDetailsContestants;
