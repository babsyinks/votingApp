import React from "react";
import Block from "../../../components/ui/Block";
import Heading from "../../../components/ui/Heading";

const ElectivePositionDetailsSummaryPart = ({ label, value }) => {
  const headingType = label === "Position" ? "h2" : "h3";
  return (
    <Block className="z-30 bg-black w-full">
      <Heading
        className="ff-patrick my-7"
        type={headingType}
      >
        {label}:{" "}
        <span className='text-sky-blue'>{value}</span>
      </Heading>
    </Block>
  );
};
export default ElectivePositionDetailsSummaryPart;
