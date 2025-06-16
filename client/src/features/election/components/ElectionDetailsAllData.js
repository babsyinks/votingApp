import { memo } from "react";
import { useSelector } from "react-redux";
import Particles from "react-tsparticles";
import { useParticles } from "../hooks/useParticles";
import Block from "../../../components/ui/Block";
import ElectionDetailsHeader from "./ElectionDetailsHeader";
import ElectivePositionDetails from "./ElectivePositionDetails";
import { timerData } from "../../timer/timerSlice";
import LiveTimer from "features/timer/components/liveElectionTimer/LiveTimer";
import params from "../config/particlesConfig";

const ElectionDetailsAllData = ({ listOfElectionData }) => {
  const timer = useSelector(timerData);
  const { particlesInit, particlesLoaded } = useParticles();

  return (
    <Block className="bg-blue-mute py-10 w-full">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={params}
      />
      <ElectionDetailsHeader message={"Please Proceed To Vote."} />
      {timer.endDate && (
        <Block type="flex-horz">
          <LiveTimer electionEndTime={timer.endDate} />
        </Block>
      )}
      {listOfElectionData.map((contestantsDetailsByPosition, i) => {
        return (
          <ElectivePositionDetails
            contestantsDetailsByPosition={contestantsDetailsByPosition}
            key={i}
          />
        );
      })}
    </Block>
  );
};

export default memo(ElectionDetailsAllData);
