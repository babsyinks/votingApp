import Span from "components/ui/Span";

export default function LiveTimerElectionOngoing({
  days,
  hours,
  minutes,
  seconds,
}) {
  const conditionallyAppendS = (unit) => {
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
