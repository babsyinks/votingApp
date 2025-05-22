import React from "react";
import Button from "../../../../../components/ui/Button";

/**
 * This component shows if the contestant owning this button has already been voted for by the current
 * logged in user. When this component rendereds, it sets the button appearance based on if the user has
 * voted for the contestant or not.
 * 
 * @param {Object} props - Component props.
 * @param {Boolean} [props.votedFor] - Indicates if the current user has already voted for this contestant
 * @returns {JSX.Element} The rendered button component.
 */
const ContestantButtonVoteCompleted = ({ votedFor }) => {
  const disabledBtnStyle = { backgroundColor: "black", cursor: "not-allowed" };
  const iTagDetails = votedFor
    ? { color: "lime", class: "fa-check-circle" }
    : { color: "red", class: "fa-times-circle" };
  return (
    <Button custom={{ custStyle: disabledBtnStyle }}>
      <i
        className={`far ${iTagDetails.class} fa-lg`}
        style={{ color: iTagDetails.color }}
      ></i>
    </Button>
  );
};
export default ContestantButtonVoteCompleted;
