import { useAxios } from "../../../../../hooks/useAxios";
import { useToastMessage } from "../../../../../hooks/useToastMessage";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../../../../components/ui/Button";
import { updateVotes } from "../../../electionSlice"; 
import { userInfo } from "../../../../user/userSlice"; 

/**
 * This component represents a single vote button. Each contestant has their own vote button that
 * voters can click on to vote.
 * 
 * @param {Object} props - Component props.
 * @param {String} [props.contestantId] - The id of the contestant who this vote button appears under.
 * @param {String} [props.position] - The position this contestant is vying for, e.g president.
 * @returns {JSX.Element} The rendered button component.
 */
const ContestantButtonVote = ({ contestantId, position }) => {
  const [disableVote, setDisableVote] = useState(false);
  const dispatch = useDispatch();
  const { userId } = useSelector(userInfo);
  const { response, error, triggerRequest } = useAxios();
  const { triggerToast } = useToastMessage();

  useEffect(() => {
    if (response) {
      const { allVotes, contestantVotes } = response;
      dispatch(
        updateVotes({ allVotes, contestantVotes, contestantId, position }),
      );
      setDisableVote(false);
    }
  }, [response, dispatch, contestantId, position]);

  useEffect(() => {
    if (error) {
      triggerToast({
        status: "failed",
        message: "An error occured! Try again later.",
      });
    }
  }, [error, triggerToast]);

  const voteForContestant = async () => {
    setDisableVote(true);

    await triggerRequest({
      params: {
        method: "PATCH",
        url: "/election/vote",
        // "https://votingapp-pmev.onrender.com/election/vote",
        data: { userId, contestantId, position },
      },
    });
  };
  return (
    <Button
      onClick={voteForContestant}
      custom={{ custClass: "rnd-corner-btn swp-col-grn" }}
      disabled={disableVote}
    >
      Vote
    </Button>
  );
};
export default ContestantButtonVote;
