import React from "react";

const ElectivePositionDetails = ({ position, totalVotes, totalContestants}) => {

  return (
      <div className="electionIntro">
        <div className="electionHead">
          <h2>
            Position: <span>{position}</span>
          </h2>
        </div>
        <div className="electionHead">
          <h3>
            Number Of Contestants:{" "}
            <span className="numOfContestants">{totalContestants}</span>
          </h3>
        </div>
        <div className="electionHead">
          <h3>
            Total Votes Cast: <span>{totalVotes}</span>
          </h3>
        </div>
      </div>
  );
};
export default ElectivePositionDetails;
