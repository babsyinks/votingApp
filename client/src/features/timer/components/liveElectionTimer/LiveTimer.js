import axios from "axios";
import React, { useState, useEffect, memo } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

//import { setTimerData } from "./features/timer/timerSlice";
import { setTimerData } from "features/timer/timerSlice";
import LiveTimerRenderer from "./LiveTimerRenderer";

function LiveTimer({ electionEndTime }) {
  const navigate = useNavigate();
  const [countDownOver, setCountDownOver] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const checkCountDown = async () => {
      if (countDownOver) {
        try {
          // https://votingapp-pmev.onrender.com/timer/end
          const { data: timerObj } = await axios.get("/timer/end");
          dispatch(setTimerData(timerObj));
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    checkCountDown();
  }, [countDownOver, navigate, dispatch]);

  return (
    <Countdown
      date={electionEndTime}
      renderer={LiveTimerRenderer}
      onComplete={() => setCountDownOver(true)}
    />
  );
}

export default memo(LiveTimer);
