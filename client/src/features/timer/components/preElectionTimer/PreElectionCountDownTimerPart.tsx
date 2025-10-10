import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import getTimePart from "features/timer/helpers/getTimePart";
import PreElectionCountDownTimerValue from "./PreElectionCountDownTimerValue";
import {
  minuteSeconds,
  hourSeconds,
  daySeconds,
} from "../../data/timePartsInSeconds";

const timerStyle = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

export interface PreElectionCountDownTimerPartProps {
  color: `#${string}` | [`#${string}`, `#${string}`, ...`#${string}`[]];
  duration: number;
  remainingTime: number;
  type: "days" | "hours" | "minutes" | "seconds";
}

function PreElectionCountDownTimerPart({
  color,
  duration,
  remainingTime,
  type,
}: PreElectionCountDownTimerPartProps) {
  const typeMapper = {
    days: daySeconds,
    hours: hourSeconds,
    minutes: minuteSeconds,
    seconds: 0,
  };
  return (
    <CountdownCircleTimer
      {...timerStyle}
      colors={Array.isArray(color) ? color : [color, color]}
      colorsTime={Array.isArray(color) ? [duration, duration / 2] : [duration, duration]}
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
