import { useEffect } from "react";
import useTimerSchedule from "../../hooks/useTimerSchedule";
import Block from "../../../../components/ui/Block";
import ElectionTimerSettingsFormInput from "./ElectionTimerSettingsFormInput";

function ElectionTimerSettingsForm({
  setElectionSchedule,
  setEnableDone,
  triggerFailureToast,
}) {
  const { mergedTimerState, startDate, startTime, endDate, endTime } =
    useTimerSchedule();

  useEffect(() => {
    if (startDate && startTime && endDate && endTime) {
      const setElectionScheduleStatus = () => {
        const startTimeStamp = getTimeStamp(startDate, startTime);
        const endTimeStamp = getTimeStamp(endDate, endTime);
        if (startTimeStamp < Date.now()) {
          triggerFailureToast("Election Date Should Not Be Set To The Past");
        } else if (endTimeStamp - startTimeStamp >= 0) {
          setEnableDone(true);
          setElectionSchedule({
            startDate: startTimeStamp,
            endDate: endTimeStamp,
          });
        } else {
          triggerFailureToast("End Date Must Be Greater Than Start Date");
        }
      };

      const getTimeStamp = (date, time) => {
        const dateMillisecondsTuned = getDateMillisecondsNumArray(date);
        const timeMillisecondsTuned = getTimeMillisecondsNumArray(time);
        return new Date(
          ...dateMillisecondsTuned,
          ...timeMillisecondsTuned,
        ).getTime();
      };

      const getDateMillisecondsNumArray = (date) => {
        return date.split("-").map((v, i) => {
          if (i === 1) {
            return +v - 1;
          } else {
            return +v;
          }
        });
      };

      const getTimeMillisecondsNumArray = (time) =>
        time.split(":").map((v) => +v);

      setElectionScheduleStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, startTime, endDate, endTime]);

  return (
    <Block>
      {" "}
      {mergedTimerState.map(({ value, onChange, ...rest }, i) => (
        <ElectionTimerSettingsFormInput
          {...rest}
          value={value}
          onChange={onChange}
          key={i}
        />
      ))}
    </Block>
  );
}

export default ElectionTimerSettingsForm;
