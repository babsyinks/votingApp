import Block from "components/ui/Block";
import ElectivePositionDetailsSummaryPart from "./ElectivePositionDetailsSummaryPart";

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
      className="border-rounded-5 border-2-white bg-black text-white my-10-mx-5 tt-cap ff-patrick"
    >
      {summaryParts.map((partDetails, i) => (
        <ElectivePositionDetailsSummaryPart {...partDetails} key={i} />
      ))}
    </Block>
  );
};
export default ElectivePositionDetailsSummary;
