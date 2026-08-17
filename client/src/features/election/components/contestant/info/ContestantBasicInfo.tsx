import React from "react";
import Span from "components/ui/Span";
import ContestantTextInfoWrapper from "./ContestantTextInfoWrapper";

/**
 * Holds a contestant's basic information, and formats it. E.g the name.
 */
export interface ContestantBasicInfoProps {
  /** The basic info type, e.g "Name". */
  type: string;
  /** The value of the type provided. E.g if type is name, the value could be 'John'. */
  value: string;
}

const ContestantBasicInfo: React.FC<ContestantBasicInfoProps> = ({ type, value }) => {
  return (
    <ContestantTextInfoWrapper>
      {type}:{" "}
      <Span className="tt-cap ff-berkshire px-0-py-5p text-blue">{value}</Span>
    </ContestantTextInfoWrapper>
  );
};

export default ContestantBasicInfo;
