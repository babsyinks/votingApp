import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useCountdownStatus from "hooks/useCountdownStatus";
import { electionStatus } from "features/election/electionSlice";
import { timerData } from "features/timer/timerSlice";
import getStatusMessage from "../helpers/getStatusMessage";
import Block from "components/ui/Block";

export default function ElectionStatusIndicator() {
  const [blinking, setBlinking] = useState(false);
  const [message, setMessage] = useState("");
  const status = useSelector(electionStatus);
  const timer = useSelector(timerData);
  useCountdownStatus(timer.startDate);
  useCountdownStatus(timer.endDate);

  useEffect(() => {
    const messageUpdate = getStatusMessage(status);
    if (messageUpdate.includes("Live")) {
      setBlinking(true);
    } else {
      setBlinking(false);
    }
    setMessage(messageUpdate);
  }, [status]);

  if (status === "inActive") return null;

  return (
    <Block className="absolute top-5p5r left-1r z-10">
      <Block
        className={`bg-red text-white px-1r-py-0p5r border-rounded-0p4r fw-600 bs-black-lite ${blinking ? "blink" : ""}`}
      >
        {message}
      </Block>
    </Block>
  );
}
