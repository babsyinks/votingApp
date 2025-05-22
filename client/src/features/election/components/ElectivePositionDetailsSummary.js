import React from "react";
import Block from "../../../components/ui/Block";
import ElectivePositionDetailsSummaryPart from "./ElectivePositionDetailsSummaryPart";
import defaultStyle from "./ElectivePositionDetailsSummary.module.css";

const ElectivePositionDetailsSummary = ({
  position,
  totalVotes,
  totalContestants,
}) => {
  const summaryParts = [
    { label: "Position", value: position },
    { label: "Number Of Contestants", value: totalContestants },
    { label: "Total Votes Cast", value: totalVotes },
  ];
  return (
    <Block
      type="flex-vert"
      className={defaultStyle["election-position-summary"]}
    >
      {summaryParts.map((partDetails, i) => (
        <ElectivePositionDetailsSummaryPart {...partDetails} key={i} />
      ))}
    </Block>
  );
};
export default ElectivePositionDetailsSummary;
