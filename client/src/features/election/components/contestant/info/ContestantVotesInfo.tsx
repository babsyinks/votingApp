import React from "react";
import ContestantTextInfoWrapper from "./ContestantTextInfoWrapper";

export interface ContestantVotesInfoProps {
  /** The type of vote information to show. E.g., Vote percentage. */
  type: string;
  /** Indicates if the voting info data should be shown or not. */
  showInfo: boolean;
  /** Child elements to render inside this component. */
  children: React.ReactNode;
}

/**
 * Holds a contestant's voting statistics and formats it. 
 * E.g percentage of votes for a contestant.
 */
const ContestantVotesInfo: React.FC<ContestantVotesInfoProps> = ({
  type,
  showInfo,
  children,
}) => {
  return (
    <ContestantTextInfoWrapper>
      {type}: {showInfo && children}
    </ContestantTextInfoWrapper>
  );
};

export default ContestantVotesInfo;
