import MultiLayerWrapper from "layout/MultiLayerWrapper";
import Heading from "components/ui/Heading";
import PreElectionCountDownTimer from "features/timer/components/preElectionTimer/PreElectionCountDownTimer";

function PreElectionCountDown({ endTime }) {
  return (
    <MultiLayerWrapper>
      <Heading type="h2">The Election Will Start In:</Heading>
      <PreElectionCountDownTimer endTime={endTime} />
      <Heading type="h2">Please Come Back To Vote Then.</Heading>
    </MultiLayerWrapper>
  );
}

export default PreElectionCountDown;
