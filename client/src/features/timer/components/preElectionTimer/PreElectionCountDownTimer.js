import React from "react";
import useOrientation from "hooks/useOrientation";
import getTimeStatus from "features/timer/helpers/getTimeStatus";
import getPreElectionTimerConfig from "features/timer/config/getPreElectionTimerConfig";
import Block from "components/ui/Block";
import PreElectionCountDownTimerPart from "./PreElectionCountDownTimerPart";

function PreElectionCountDownTimer({ endTime }) {
  const { remainingTime, daysDuration } = getTimeStatus(endTime);
  const preElectionTimerConfig = getPreElectionTimerConfig(daysDuration);
  const isPortrait = useOrientation();

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
