import Span from "components/ui/Span";
import LiveTimerElectionOver from "./LiveTimerElectionOver";
import LiveTimerElectionOngoing from "./LiveTimerElectionOngoing";

export default function LiveTimerRenderer({
  days,
  hours,
  minutes,
  seconds,
  completed,
}) {
  let Component;
  let props = {};
  if (completed) {
    Component = LiveTimerElectionOver;
  } else {
    Component = LiveTimerElectionOngoing;
    props = { days, hours, minutes, seconds };
  }
  return (
    <Span className="text-sky-blue fw-bold py-10 text-responsive-1p5">
      <Component {...props} />
    </Span>
  );
}
