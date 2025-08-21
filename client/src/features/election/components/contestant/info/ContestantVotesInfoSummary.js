import React from "react";
import PropTypes from "prop-types";
import Span from "components/ui/Span";
import ContestantVotesInfo from "./ContestantVotesInfo";

/**
 *
 * It details the summary of current election voting status for a contestant; it shows the votes obtained
 * by a contestant out of total votes cast.
 *
 * @param {Object} props - Component props.
 * @param {Boolean} [props.showInfo] - Indicates if the votes obtained by the contestant should be displayed or not
 * @param {Number} [props.contestantVotes] - The votes obtained so far by the contestant in the ongoing election
 * @param {Number} [props.totalVotes] - The total votes cast in a given category in the election. E.g total
 * votes cast in the category for president.
 * @param {Boolean} [props.showExpandedStats] - This indicates if more voting data should be displayed or not.
 * @param {React.ReactNode} [props.children] - Child elements to render inside this component.
 * @returns {JSX.Element} - The rendered ContestantVotesInfoSummary component.
 */
const ContestantVotesInfoSummary = ({
  showInfo,
  contestantVotes,
  totalVotes,
  showExpandedStats,
}) => {
  return (
    <ContestantVotesInfo type="Votes" showInfo={showInfo}>
      <Span> 
        <Span className="text-purple-cool fs-italic px-0-py-5">{contestantVotes}</Span>{" "}
        {showExpandedStats && (
          <>
            out of <Span className="text-purple-dark fs-italic">{totalVotes}</Span>
          </>
        )}
      </Span>
    </ContestantVotesInfo>
  );
};

ContestantVotesInfoSummary.propTypes = {
  showInfo: PropTypes.bool.isRequired,
  contestantVotes: PropTypes.number.isRequired,
  totalVotes: PropTypes.number.isRequired,
  showExpandedStats: PropTypes.bool.isRequired,
};

export default ContestantVotesInfoSummary;
