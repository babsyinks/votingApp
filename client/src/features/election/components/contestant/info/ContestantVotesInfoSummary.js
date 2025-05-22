import React from "react";
import PropTypes from "prop-types";
import ContestantVotesInfo from "./ContestantVotesInfo";
import style from "./ContestantVotesInfoSummary.module.css";

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
 * @param {React.ReactNode} [props.children] - Child elements to render inside this component.
 * @returns {JSX.Element} - The rendered ContestantVotesInfoSummary component.
 */
const ContestantVotesInfoSummary = ({
  showInfo,
  contestantVotes,
  totalVotes,
}) => {
  return (
    <ContestantVotesInfo type="Votes" showInfo={showInfo}>
      <span>
        <span className={style["contestant-votes"]}>{contestantVotes}</span> out
        of <span className={style["total-votes"]}>{totalVotes}</span>
      </span>
    </ContestantVotesInfo>
  );
};

ContestantVotesInfoSummary.propTypes = {
  showInfo: PropTypes.bool.isRequired,
  contestantVotes: PropTypes.number.isRequired,
  totalVotes: PropTypes.number.isRequired,
};

export default ContestantVotesInfoSummary;
