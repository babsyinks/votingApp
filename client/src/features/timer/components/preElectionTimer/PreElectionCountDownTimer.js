import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import useOrientation from "hooks/useOrientation";
import { setTimerData } from "features/timer/timerSlice";
import getTimeStatus from "features/timer/helpers/getTimeStatus";
import getPreElectionTimerConfig from "features/timer/config/getPreElectionTimerConfig";
import Block from "components/ui/Block";
import PreElectionCountDownTimerPart from "./PreElectionCountDownTimerPart";

function PreElectionCountDownTimer({ endTime }) {
  const { remainingTime, daysDuration } = getTimeStatus(endTime);
  const preElectionTimerConfig = getPreElectionTimerConfig(daysDuration);
  const dispatch = useDispatch();
  const isPortrait = useOrientation();

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
      {preElectionTimerConfig.map((parts, i) => (
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
