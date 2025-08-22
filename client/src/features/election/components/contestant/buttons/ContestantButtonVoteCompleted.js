import React from "react";
import Button from "components/ui/Button";
import I from "components/ui/I";

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
  const iTagDetails = votedFor
    ? { color: "text-lime", class: "fa-check-circle" }
    : { color: "text-red", class: "fa-times-circle" };
  return (
    <Button
      className={`rnd-corner-btn rnd-corner-btn-sized bg-black cs-not-allowed ${iTagDetails.color}`}
    >
      <I className={`far ${iTagDetails.class} fa-lg cs-not-allowed`}></I>
    </Button>
  );
};
export default ContestantButtonVoteCompleted;
