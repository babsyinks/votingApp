import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import getTimePart from "features/timer/helpers/getTimePart";
import PreElectionCountDownTimerValue from "./PreElectionCountDownTimerValue";
import {
  minuteSeconds,
  hourSeconds,
  daySeconds,
} from "../../config/timePartsInSeconds";

const timerStyle = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

function PreElectionCountDownTimerPart({
  color,
  duration,
  remainingTime,
  type,
}) {
  const typeMapper = {
    days: daySeconds,
    hours: hourSeconds,
    minutes: minuteSeconds,
    seconds: 0,
  };
  return (
    <CountdownCircleTimer
      {...timerStyle}
      colors={color}
      duration={duration}
      initialRemainingTime={
        type === "days" ? remainingTime : remainingTime % duration
      }
      {...(type !== "days" && {
        onComplete: (totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > typeMapper[type],
        }),
      })}
    >
      {({ elapsedTime }) => (
        <PreElectionCountDownTimerValue
          dimension={type}
          time={getTimePart({
            type,
            time: type === "seconds" ? elapsedTime : duration - elapsedTime,
          })}
        />
      )}
    </CountdownCircleTimer>
  );
}

export default PreElectionCountDownTimerPart;
