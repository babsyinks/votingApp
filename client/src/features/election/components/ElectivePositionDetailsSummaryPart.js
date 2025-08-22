import React from "react";
import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import Span from "components/ui/Span";

const ElectivePositionDetailsSummaryPart = ({ label, value }) => {
  const headingType = label === "Position" ? "h2" : "h3";
  return (
    <Block className="z-30 bg-black w-full">
      <Heading
        className="ff-patrick mx-0-my-7 ta-center"
        type={headingType}
      >
        {label}:{" "}
        <Span className='text-sky-blue'>{value}</Span>
      </Heading>
    </Block>
  );
};
export default ElectivePositionDetailsSummaryPart;
