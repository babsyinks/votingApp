import React from "react";
import PropTypes from "prop-types";
import Span from "components/ui/Span";
import ContestantVotesInfo from "./ContestantVotesInfo";

/**
 *
 * This shows the percentage of votes obtained by a contestant relative to other contestants. It also assigns the
 * proper color to emphasize the standing of the contestant in the election.
 *
 * @param {Object} props - Component props.
 * @param {Boolean} [props.showInfo] - Indicates if the votes percentage should be displayed or not.
 * @param {Number} [props.contestantVotes] - The votes obtained so far by the contestant in the ongoing election
 * @param {Number} [props.totalVotes] - The total votes cast in a given category in the election. E.g total
 * votes cast in the category for president.
 * @param {String} [props.contestantElectionStatusColor] - The color-code showing the contestant standing in the elction.
 * A green color shows a good standing, a yellow color an average standing, and a red color shows a bad standing.
 * @param {React.ReactNode} [props.children] - Child elements to render inside this component.
 * @returns {JSX.Element} - The rendered ContestantVotesInfoStat component.
 */
const ContestantVotesInfoStat = ({
  showInfo,
  contestantVotes,
  totalVotes,
  contestantElectionStatusColor,
}) => {
  const getContestantVotePercent = () => {
    let contestantVotePercent;
    if (contestantVotes === 0 && totalVotes === 0) {
      contestantVotePercent = 0;
    } else {
      contestantVotePercent = (contestantVotes / totalVotes) * 100;
    }
    return `${Math.round(contestantVotePercent)}%`;
  };
  return (
    <ContestantVotesInfo type="Vote Percent" showInfo={showInfo}>
      <Span>
        <Span
          className="fs-italic fw-bold p-5 bg-black border-rounded-100p"
          style={{ color: contestantElectionStatusColor }}
        >
          {getContestantVotePercent()}
        </Span>
      </Span>
    </ContestantVotesInfo>
  );
};

ContestantVotesInfoStat.propTypes = {
  showInfo: PropTypes.bool.isRequired,
  contestantVotes: PropTypes.number.isRequired,
  totalVotes: PropTypes.number.isRequired,
  contestantElectionStatusColor: PropTypes.string.isRequired,
};

export default ContestantVotesInfoStat;
