import React, { useState, useEffect, memo } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { timerData } from "features/timer/timerSlice";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";
import LiveTimerRenderer from "./LiveTimerRenderer";

function LiveTimer({ electionEndTime }) {
  const [countDownOver, setCountDownOver] = useState(false);
  const dispatch = useDispatch();
  const timer = useSelector(timerData);

  useEffect(() => {
    const checkCountDown = async () => {
      if (countDownOver) {
        dispatch(updateElectionStatusFromTimer(timer));
      }
    };
    checkCountDown();
  }, [countDownOver, dispatch, timer]);

  return (
    <Countdown
      date={electionEndTime}
      renderer={LiveTimerRenderer}
      onComplete={() => setCountDownOver(true)}
    />
  );
}

export default memo(LiveTimer);
