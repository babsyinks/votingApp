import { useAxios } from "hooks/useAxios";
import React, { useState, useEffect, memo } from "react";
import Countdown from "react-countdown";
import { useDispatch } from "react-redux";

import { setTimerData } from "features/timer/timerSlice";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";
import LiveTimerRenderer from "./LiveTimerRenderer";

function LiveTimer({ electionEndTime }) {
  const [countDownOver, setCountDownOver] = useState(false);
  const dispatch = useDispatch();
  const { response, triggerRequest } = useAxios();

  useEffect(() => {
    const checkCountDown = async () => {
      if (countDownOver) {
        await triggerRequest({
          params: {
            method: "GET",
            url: "/timer/end",
          },
        });
        // https://votingapp-pmev.onrender.com/timer/end
      }
    };
    checkCountDown();
  }, [countDownOver, triggerRequest]);

  useEffect(() => {
    if (response) {
      dispatch(setTimerData(response));
      dispatch(updateElectionStatusFromTimer(response));
    }
  }, [dispatch, response]);

  return (
    <Countdown
      date={electionEndTime}
      renderer={LiveTimerRenderer}
      onComplete={() => setCountDownOver(true)}
    />
  );
}

export default memo(LiveTimer);
