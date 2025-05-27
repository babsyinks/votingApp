import React from "react";
import Button from "../../../../../components/ui/Button";
import style from "./ContestantButtonVoteCompleted.module.css";

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
    ? { color: "voted-for", class: "fa-check-circle" }
    : { color: "voted-against", class: "fa-times-circle" };
  return (
    <Button
      className={`rnd-corner-btn rnd-corner-btn-sized ${style["vote-completed"]} ${style[iTagDetails.color]}`}
    >
      <i className={`far ${iTagDetails.class} fa-lg`}></i>
    </Button>
  );
};
export default ContestantButtonVoteCompleted;
