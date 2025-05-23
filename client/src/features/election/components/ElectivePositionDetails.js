import React from "react";
import { useSelector } from "react-redux";
import ElectivePositionDetailsContestants from "./ElectivePositionDetailsContestants";
import ElectivePositionDetailsSummary from "./ElectivePositionDetailsSummary";
import Block from "../../../components/ui/Block";
import {
  getAllVotesInACategory,
  getAllContestantsInCategory,
} from "../electionSlice";
import "./ElectivePositionDetails.css";

const ElectivePositionDetails = ({ contestantsDetailsByPosition }) => {
  const { position } = contestantsDetailsByPosition;
  const listOfVotesCastInCategory = useSelector(
    getAllVotesInACategory(position),
  );
  const contestantsList = useSelector(getAllContestantsInCategory(position));

  return (
    <Block style={{ textAlign: "center" }}>
      <ElectivePositionDetailsSummary
        position={position}
        totalContestants={contestantsList.length}
        totalVotes={listOfVotesCastInCategory.length}
      />
      <ElectivePositionDetailsContestants
        contestantsList={contestantsList}
        position={position}
        listOfVotesCastInCategory={listOfVotesCastInCategory}
      />
    </Block>
  );
};
export default ElectivePositionDetails;
