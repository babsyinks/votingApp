import React from "react";
import { useSelector } from "react-redux";
import ElectivePositionDetailsContestants from "./ElectivePositionDetailsContestants";
import ElectivePositionDetailsSummary from "./ElectivePositionDetailsSummary";
import Block from "components/ui/Block";
import {
  getAllVotesInACategory,
  getAllContestantsInCategory,
} from "../electionSlice";
import { ElectionData } from "./ElectionDetailsAllData";

export interface ElectivePositionDetailsProps {
  contestantsDetailsByPosition: ElectionData;
}

const ElectivePositionDetails: React.FC<ElectivePositionDetailsProps> = ({
  contestantsDetailsByPosition,
}) => {
  const { position } = contestantsDetailsByPosition;

  const listOfVotesCastInCategory = useSelector(
    getAllVotesInACategory(position),
  );
  const contestantsList = useSelector(getAllContestantsInCategory(position));

  return (
    <Block className="ta-center">
      <ElectivePositionDetailsSummary
        position={position}
        totalContestants={contestantsList?.length || 0}
        totalVotes={listOfVotesCastInCategory?.length || 0}
      />
      <ElectivePositionDetailsContestants
        contestantsList={contestantsList ?? []}
        position={position}
        listOfVotesCastInCategory={listOfVotesCastInCategory ?? []}
      />
    </Block>
  );
};

export default ElectivePositionDetails;
