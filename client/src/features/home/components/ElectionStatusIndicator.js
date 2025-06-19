import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { electionStatus } from "features/election/electionSlice";
import getStatusMessage from "../helpers/getStatusMessage";
import Block from "components/ui/Block";

export default function ElectionStatusIndicator() {
  const [blinking, setBlinking] = useState(false);
  const [message, setMessage] = useState("");
  const status = useSelector(electionStatus);

  useEffect(() => {
    const messageUpdate = getStatusMessage(status);
    if (messageUpdate.includes("Ongoing")) {
      setBlinking(true);
    } else {
      setBlinking(false);
    }
    setMessage(messageUpdate);
  }, [status]);

  if (status === "inActive") return null;

  return (
    <Block className="absolute top-1r left-1r z-10">
      <Block
        className={`bg-red text-white py-0p5-px-1r border-rounded-0p4r fw-600 bs-black-lite ${blinking ? "blink" : ""}`}
      >
        {message}
      </Block>
    </Block>
  );
}
