import Block from "components/ui/Block";

export interface PreElectionCountDownTimerValueProps {
  dimension: string;
  time: number;
}

function PreElectionCountDownTimerValue({
  dimension,
  time,
}: PreElectionCountDownTimerValueProps) {
  return (
    <Block>
      <Block className="text-32">{time}</Block>
      <Block>{dimension}</Block>
    </Block>
  );
}

export default PreElectionCountDownTimerValue;
