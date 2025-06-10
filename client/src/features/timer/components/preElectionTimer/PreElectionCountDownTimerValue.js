import Block from "components/ui/Block";

function PreElectionCountDownTimerValue({ dimension, time }) {
  return (
    <Block>
      <Block className="text-32">{time}</Block>
      <Block>{dimension}</Block>
    </Block>
  );
}

export default PreElectionCountDownTimerValue;
