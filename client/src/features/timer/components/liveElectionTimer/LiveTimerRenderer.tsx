import Span from "components/ui/Span";
import LiveTimerElectionOver from "./LiveTimerElectionOver";
import LiveTimerElectionOngoing, {
  LiveTimerElectionOngoingProps,
} from "./LiveTimerElectionOngoing";

export interface LiveTimerRendererProps extends LiveTimerElectionOngoingProps {
  completed: boolean;
}

export default function LiveTimerRenderer({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: LiveTimerRendererProps) {
  return (
    <Span className="text-sky-blue fw-bold px-0-py-10 text-responsive-1p5">
      {completed ? (
        <LiveTimerElectionOver />
      ) : (
        <LiveTimerElectionOngoing
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      )}
    </Span>
  );
}
