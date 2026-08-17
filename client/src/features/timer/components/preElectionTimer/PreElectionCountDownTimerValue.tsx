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
      <Block className="text-32p">{time}</Block>
      <Block>{dimension}</Block>
    </Block>
  );
}

export default PreElectionCountDownTimerValue;
