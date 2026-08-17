import { memo } from "react";
import { useSelector } from "react-redux";
import Particles from "react-tsparticles";
import { Engine, Container } from "tsparticles-engine";
import { useParticles } from "../hooks/useParticles";
import Block from "components/ui/Block";
import ElectionDetailsHeader from "./ElectionDetailsHeader";
import ElectivePositionDetails from "./ElectivePositionDetails";
import { timerData } from "features/timer/timerSlice";
import LiveTimer from "features/timer/components/liveElectionTimer/LiveTimer";
import params from "../config/particlesConfig";

export interface ElectionData {
  position: string;
}

interface ElectionDetailsAllDataProps {
  listOfElectionData: ElectionData[];
}

const ElectionDetailsAllData: React.FC<ElectionDetailsAllDataProps> = ({
  listOfElectionData,
}) => {
  const timer = useSelector(timerData);
  const { particlesInit, particlesLoaded } = useParticles();

  return (
    <Block className="bg-blue-mute px-0-py-10p w-full">
      <Particles
        id="tsparticles"
        init={particlesInit as (engine: Engine) => Promise<void>}
        loaded={particlesLoaded as unknown as (container?: Container) => Promise<void>}
        options={params}
      />
      <ElectionDetailsHeader message="Please Proceed To Vote." />
      {timer.endDate && timer.endDate > Date.now() && (
        <Block type="flex-horz">
          <LiveTimer electionEndTime={timer.endDate} />
        </Block>
      )}
      {listOfElectionData.map((contestantsDetailsByPosition, i) => (
        <ElectivePositionDetails
          contestantsDetailsByPosition={contestantsDetailsByPosition}
          key={i}
        />
      ))}
    </Block>
  );
};

export default memo(ElectionDetailsAllData);
