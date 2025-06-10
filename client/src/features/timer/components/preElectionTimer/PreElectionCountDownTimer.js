import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import useOrientation from "hooks/useOrientation";
import { setTimerData } from "features/timer/timerSlice";
import {
  minuteSeconds,
  hourSeconds,
  daySeconds,
} from "../../config/timePartsInSeconds";
import Block from "components/ui/Block";
import PreElectionCountDownTimerPart from "./PreElectionCountDownTimerPart";

function PreElectionCountDownTimer({ endTime }) {
  const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const remainingTime = endTime / 1000 - startTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;
  const dispatch = useDispatch();
  const isPortrait = useOrientation();

  const countdownTimerPartList = [
    { color: "#7E2E84", duration: daysDuration, type: "days" },
    { color: "#D14081", duration: daySeconds, type: "hours" },
    { color: "#EF798A", duration: hourSeconds, type: "minutes" },
    { color: "#218380", duration: minuteSeconds, type: "seconds" },
  ];

  useEffect(() => {
    const endCountDown = async () => {
      try {
        const { data: timerObj } = await axios.get(
          // "https://votingapp-pmev.onrender.com/timer/cancelStart",
          "/timer/cancelStart",
        );
        dispatch(setTimerData(timerObj));
        clearInterval(timerInterval);
      } catch (error) {
        console.log(error.message);
      }
    };

    let timerInterval;

    const checkTimerStatus = async () => {
      const endTimeSecs = endTime / 1000;
      timerInterval = setInterval(() => {
        const remainingTimeSecs = endTimeSecs - Date.now() / 1000;
        const timerStatus = async () => {
          if (remainingTimeSecs <= 0) {
            await endCountDown();
          }
        };
        timerStatus();
      }, 1000);
    };
    checkTimerStatus();

    return () => {
      clearInterval(timerInterval);
    };
  }, [dispatch, endTime]);

  return (
    <Block
      type={isPortrait ? "flex-vert-sa" : "flex-horz-sa"}
      className="ta-center"
    >
      {countdownTimerPartList.map((parts, i) => (
        <PreElectionCountDownTimerPart
          remainingTime={remainingTime}
          {...parts}
          key={i}
        />
      ))}
    </Block>
  );
}

export default PreElectionCountDownTimer;
