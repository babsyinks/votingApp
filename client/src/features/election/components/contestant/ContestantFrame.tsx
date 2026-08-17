import React from "react";
import Block from "components/ui/Block";

export interface ContestantFrameProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Represents a frame for a single contestant. This frame is a container having the right structure and
 * formatting to hold all pertinent information about a contestant. E.g name, picture, votes, etc.
 */
const ContestantFrame: React.FC<ContestantFrameProps> = ({ className = "", children }) => {
  return (
    <Block
      className={`z-30 p-10p border-2-grey border-rounded-5 ml-2p bg-white fw-bold ${className}`}
    >
      {children}
    </Block>
  );
};

export default ContestantFrame;
