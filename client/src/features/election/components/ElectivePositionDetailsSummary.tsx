import React from "react";
import Block from "components/ui/Block";
import ElectivePositionDetailsSummaryPart from "./ElectivePositionDetailsSummaryPart";
import { ElectivePositionDetailsSummaryPartProps } from "./ElectivePositionDetailsSummaryPart";

export interface ElectivePositionDetailsSummaryProps {
  position: string;
  totalVotes: number;
  totalContestants: number;
}

const ElectivePositionDetailsSummary: React.FC<
  ElectivePositionDetailsSummaryProps
> = ({ position, totalVotes, totalContestants }) => {
  const summaryParts: ElectivePositionDetailsSummaryPartProps[] = [
    { label: "Position", value: position },
    { label: "Number Of Contestants", value: totalContestants },
    { label: "Total Votes Cast", value: totalVotes },
  ];

  return (
    <Block
      type="flex-vert"
      className="border-rounded-5 border-2-white bg-black text-white mx-5-my-10 tt-cap ff-patrick"
    >
      {summaryParts.map((partDetails, i) => (
        <ElectivePositionDetailsSummaryPart {...partDetails} key={i} />
      ))}
    </Block>
  );
};

export default ElectivePositionDetailsSummary;
