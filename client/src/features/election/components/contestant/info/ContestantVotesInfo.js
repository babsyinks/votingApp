import React from "react";
import PropTypes from "prop-types";
import ContestantTextInfoWrapper from "./ContestantTextInfoWrapper";
/**
 * Holds a contestant's voting statistics and formats it. E.g percentage of votes for a contestant.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of vote information to show. E.g Vote percentage.
 * @param {Boolean} [props.showInfo] - Indicates if the voting info data should be shown or not.
 * @param {React.ReactNode} [props.children] - Child elements to render inside this component.
 * @returns {JSX.Element} - The rendered ContestantVotesInfo component.
 */
const ContestantVotesInfo = ({ type, showInfo, children }) => {
  return (
    <ContestantTextInfoWrapper>
      {type}: {showInfo && children}
    </ContestantTextInfoWrapper>
  );
};
ContestantVotesInfo.propTypes = {
  type: PropTypes.string.isRequired,
  showInfo: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
export default ContestantVotesInfo;
