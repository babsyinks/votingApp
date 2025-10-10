import Span from "components/ui/Span";

export interface LiveTimerElectionOngoingProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function LiveTimerElectionOngoing({
  days,
  hours,
  minutes,
  seconds,
}: LiveTimerElectionOngoingProps) {
  const conditionallyAppendS = (unit: number): string => {
    return unit <= 1 ? "" : "s";
  };

  return (
    <>
      <Span className="text-red">Election Will End In:</Span> {days} day
      {conditionallyAppendS(days)}, {hours} hour
      {conditionallyAppendS(hours)}, {minutes} minute
      {conditionallyAppendS(minutes)}, {seconds} second
      {conditionallyAppendS(seconds)}.
    </>
  );
}
