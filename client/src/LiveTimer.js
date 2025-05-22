import axios from "axios";
import React, { useState, useEffect, memo } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setTimerData } from "./features/timer/timerSlice";
import "./LiveTimer.css";

// Random component
const Completionist = () => (
  <span className="electionCountDown">
    <span>Election Is Now Over!</span>
  </span>
);
const crt = (t) => {
  return t <= 1 ? "" : "s";
};

function LiveTimer({
  electionEndTime,
}) {
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
  }, [
    countDownOver,
    navigate,
    dispatch,
  ]);

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      setCountDownOver(true);
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span className="electionCountDown">
          <span>Election Will End In:</span> {days} day{crt(days)}, {hours} hour
          {crt(hours)}, {minutes} minute{crt(minutes)}, {seconds} second
          {crt(seconds)}.
        </span>
      );
    }
  };

  return <Countdown date={electionEndTime} renderer={renderer} />;
}

export default memo(LiveTimer)
